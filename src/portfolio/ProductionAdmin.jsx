import { useCallback, useEffect, useMemo, useState } from "react";
import { ASSET_BASE, categories } from "./data";
import {
  isCloudConfigured,
  notifyPortfolioUpdated,
  PROJECT_IMAGES_BUCKET,
  projectFromRow,
  projectToRow,
  supabase,
} from "./supabase";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const emptyProject = () => ({
  databaseId: "",
  id: "",
  title: "",
  category: "Case Study",
  client: "",
  agency: "",
  year: String(new Date().getFullYear()),
  role: "",
  image: "",
  thumbnailPath: "",
  videoUrl: "",
  featured: false,
  published: false,
  description: "",
  brief: "",
  challenge: "",
  approach: "",
  result: "",
  credits: "",
  sortOrder: 0,
});

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function validYouTubeUrl(value) {
  if (!value) return true;
  try {
    const hostname = new URL(value).hostname.replace(/^www\./, "");
    return ["youtube.com", "youtu.be", "youtube-nocookie.com"].includes(hostname);
  } catch {
    return false;
  }
}

function messageFrom(error, fallback) {
  return error?.message || fallback;
}

export default function ProductionAdmin() {
  const [session, setSession] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState([]);
  const [settings, setSettings] = useState({ showreel_url: "", showreel_caption: "" });
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProject());
  const [imageFile, setImageFile] = useState(null);
  const [removedImagePath, setRemovedImagePath] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadAdminData = useCallback(async () => {
    const [projectResult, settingsResult] = await Promise.all([
      supabase.from("projects").select("*").order("sort_order", { ascending: true }),
      supabase.from("site_settings").select("*").eq("id", "default").maybeSingle(),
    ]);

    if (projectResult.error) throw projectResult.error;
    if (settingsResult.error) throw settingsResult.error;
    setProjects(projectResult.data.map(projectFromRow));
    if (settingsResult.data) {
      setSettings({
        showreel_url: settingsResult.data.showreel_url || "",
        showreel_caption: settingsResult.data.showreel_caption || "",
      });
    }
  }, []);

  const verifyAdmin = useCallback(
    async (nextSession) => {
      if (!nextSession?.user) {
        setAuthorized(false);
        setChecking(false);
        return;
      }

      setChecking(true);
      const { data, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", nextSession.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleError || !data) {
        setAuthorized(false);
        setError("Tài khoản này chưa được cấp quyền quản trị.");
        await supabase.auth.signOut();
        setChecking(false);
        return;
      }

      try {
        setAuthorized(true);
        await loadAdminData();
      } catch (loadError) {
        setError(messageFrom(loadError, "Không thể tải dữ liệu quản trị."));
      } finally {
        setChecking(false);
      }
    },
    [loadAdminData],
  );

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return undefined;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      verifyAdmin(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) setAuthorized(false);
    });

    return () => listener.subscription.unsubscribe();
  }, [verifyAdmin]);

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => a.sortOrder - b.sortOrder),
    [projects],
  );

  const login = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setPassword("");

    if (loginError) {
      setError("Email hoặc mật khẩu không đúng.");
      setBusy(false);
      return;
    }

    setSession(data.session);
    await verifyAdmin(data.session);
    setBusy(false);
  };

  const logOut = async () => {
    setBusy(true);
    await supabase.auth.signOut();
    setSession(null);
    setAuthorized(false);
    setBusy(false);
  };

  const openNewProject = () => {
    setForm({ ...emptyProject(), sortOrder: projects.length + 1 });
    setImageFile(null);
    setRemovedImagePath("");
    setEditing("new");
    setError("");
  };

  const openProject = (project) => {
    setForm({ ...project });
    setImageFile(null);
    setRemovedImagePath("");
    setEditing(project.databaseId);
    setError("");
  };

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const replaceImageUrl = (value) => {
    if (form.thumbnailPath && !removedImagePath) {
      setRemovedImagePath(form.thumbnailPath);
    }
    setImageFile(null);
    setForm((current) => ({
      ...current,
      image: value,
      thumbnailPath: "",
    }));
  };

  const uploadImage = async (file, slug) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error("Chỉ chấp nhận ảnh JPEG, PNG, WebP hoặc GIF.");
    }
    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error("Ảnh phải nhỏ hơn hoặc bằng 10 MB.");
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = `${slug}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from(PROJECT_IMAGES_BUCKET)
      .upload(safeName, file, { cacheControl: "3600", upsert: false });

    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from(PROJECT_IMAGES_BUCKET).getPublicUrl(safeName);
    return { path: safeName, url: data.publicUrl };
  };

  const saveProject = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");

    const slug = slugify(form.id || form.title);
    if (!slug) {
      setError("Vui lòng nhập tiêu đề hoặc đường dẫn hợp lệ.");
      setBusy(false);
      return;
    }
    if (!validYouTubeUrl(form.videoUrl)) {
      setError("Đường dẫn video phải là URL của YouTube hoặc youtu.be.");
      setBusy(false);
      return;
    }

    let nextForm = { ...form, id: slug };
    let newlyUploadedPath = "";

    try {
      if (imageFile) {
        const uploaded = await uploadImage(imageFile, slug);
        newlyUploadedPath = uploaded.path;
        nextForm = { ...nextForm, image: uploaded.url, thumbnailPath: uploaded.path };
      }

      const row = projectToRow(nextForm);
      const result =
        editing === "new"
          ? await supabase.from("projects").insert(row).select("*").single()
          : await supabase.from("projects").update(row).eq("id", editing).select("*").single();

      if (result.error) throw result.error;

      if (
        editing !== "new" &&
        imageFile &&
        form.thumbnailPath &&
        form.thumbnailPath !== newlyUploadedPath
      ) {
        await supabase.storage.from(PROJECT_IMAGES_BUCKET).remove([form.thumbnailPath]);
      }
      if (removedImagePath && removedImagePath !== newlyUploadedPath) {
        await supabase.storage.from(PROJECT_IMAGES_BUCKET).remove([removedImagePath]);
      }

      await loadAdminData();
      notifyPortfolioUpdated();
      setEditing(null);
      setRemovedImagePath("");
      setNotice(editing === "new" ? "Đã tạo dự án." : "Đã lưu thay đổi.");
    } catch (saveError) {
      if (newlyUploadedPath) {
        await supabase.storage.from(PROJECT_IMAGES_BUCKET).remove([newlyUploadedPath]);
      }
      setError(messageFrom(saveError, "Không thể lưu dự án."));
    } finally {
      setBusy(false);
    }
  };

  const deleteProject = async (project) => {
    if (!window.confirm(`Xóa vĩnh viễn dự án “${project.title}”?`)) return;
    setBusy(true);
    setError("");
    setNotice("");

    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.databaseId);

    if (deleteError) {
      setError(messageFrom(deleteError, "Không thể xóa dự án."));
    } else {
      if (project.thumbnailPath) {
        await supabase.storage.from(PROJECT_IMAGES_BUCKET).remove([project.thumbnailPath]);
      }
      await loadAdminData();
      notifyPortfolioUpdated();
      setNotice("Đã xóa dự án.");
    }
    setBusy(false);
  };

  const saveSettings = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    if (!validYouTubeUrl(settings.showreel_url)) {
      setError("Đường dẫn showreel phải là URL của YouTube hoặc youtu.be.");
      setBusy(false);
      return;
    }

    const { error: settingsError } = await supabase
      .from("site_settings")
      .update(settings)
      .eq("id", "default");

    if (settingsError) setError(messageFrom(settingsError, "Không thể lưu showreel."));
    else {
      notifyPortfolioUpdated();
      setNotice("Đã lưu thông tin showreel.");
    }
    setBusy(false);
  };

  if (!isCloudConfigured) {
    return (
      <section className="admin-login">
        <div className="admin-login-card">
          <img src={`${ASSET_BASE}/logo.png`} alt="Dai Nguyen" />
          <span className="eyebrow">Cloud chưa được cấu hình</span>
          <h1>Admin chưa sẵn sàng</h1>
          <p>Website cần biến môi trường Supabase của Lovable Cloud để mở trang quản trị.</p>
        </div>
      </section>
    );
  }

  if (checking) {
    return <section className="admin-loading">Đang kiểm tra quyền quản trị…</section>;
  }

  if (!session || !authorized) {
    return (
      <section className="admin-login">
        <div className="admin-login-card">
          <img src={`${ASSET_BASE}/logo.png`} alt="Dai Nguyen" />
          <span className="eyebrow">Khu vực riêng tư</span>
          <h1>Portfolio Admin</h1>
          <p>Đăng nhập để quản lý dự án, hình ảnh và đường dẫn video.</p>
          <form onSubmit={login} autoComplete="off">
            <label>
              Email
              <input
                required
                autoComplete="off"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label>
              Mật khẩu
              <input
                required
                autoComplete="current-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            {error && (
              <p className="admin-alert error" role="alert">
                {error}
              </p>
            )}
            <button className="button" disabled={busy} type="submit">
              {busy ? "Đang đăng nhập…" : "Đăng nhập"}
            </button>
          </form>
          <small>Mật khẩu được xác thực an toàn bởi Lovable Cloud, không lưu trong website.</small>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-shell">
      <aside className="admin-sidebar">
        <img src={`${ASSET_BASE}/logo.png`} alt="Dai Nguyen" />
        <div>
          <span className="eyebrow">Lovable Cloud CMS</span>
          <h2>Portfolio Admin</h2>
          <p>Quản lý nội dung đang hiển thị trên website.</p>
          <small className="admin-user">{session.user.email}</small>
        </div>
        <div className="admin-sidebar-actions">
          <a className="button button-quiet" href="/" target="_blank" rel="noreferrer">
            Xem website
          </a>
          <button className="text-link" disabled={busy} onClick={logOut}>
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">Thư viện nội dung</span>
            <h1>Dự án</h1>
          </div>
          <button className="button" disabled={busy} onClick={openNewProject}>
            + Thêm dự án
          </button>
        </div>

        {error && (
          <p className="admin-alert error" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="admin-alert success" role="status">
            {notice}
          </p>
        )}

        <section className="admin-stats" aria-label="Tổng quan dự án">
          <article>
            <span>Tổng dự án</span>
            <strong>{projects.length}</strong>
          </article>
          <article>
            <span>Đã công khai</span>
            <strong>{projects.filter((project) => project.published).length}</strong>
          </article>
          <article>
            <span>Bản nháp</span>
            <strong>{projects.filter((project) => !project.published).length}</strong>
          </article>
          <article>
            <span>Nổi bật</span>
            <strong>{projects.filter((project) => project.featured).length}</strong>
          </article>
        </section>

        <div className="admin-table">
          {sortedProjects.map((project) => (
            <article key={project.databaseId}>
              <img src={project.image || `${ASSET_BASE}/case-study.webp`} alt="" />
              <div>
                <strong>{project.title}</strong>
                <span>
                  #{project.sortOrder} · {project.category} · {project.year}
                </span>
              </div>
              <span className={project.published ? "status published" : "status draft"}>
                {project.published ? "Đã đăng" : "Bản nháp"}
              </span>
              <div className="row-actions">
                <button
                  disabled={busy}
                  onClick={() => openProject(project)}
                  aria-label={`Sửa ${project.title}`}
                >
                  Sửa
                </button>
                <button
                  disabled={busy}
                  onClick={() => deleteProject(project)}
                  aria-label={`Xóa ${project.title}`}
                >
                  Xóa
                </button>
              </div>
            </article>
          ))}
        </div>

        <form className="admin-settings" onSubmit={saveSettings}>
          <div>
            <span className="eyebrow">Video chính</span>
            <h2>Showreel</h2>
            <p>Video nên được tải lên YouTube ở chế độ Unlisted, sau đó dán URL vào đây.</p>
          </div>
          <label>
            YouTube URL
            <input
              value={settings.showreel_url}
              onChange={(event) => setSettings({ ...settings, showreel_url: event.target.value })}
              placeholder="https://youtu.be/..."
            />
          </label>
          <label>
            Chú thích
            <input
              value={settings.showreel_caption}
              onChange={(event) =>
                setSettings({ ...settings, showreel_caption: event.target.value })
              }
            />
          </label>
          <button className="button button-quiet" disabled={busy} type="submit">
            Lưu showreel
          </button>
        </form>
      </main>

      {editing && (
        <div className="modal-backdrop" onMouseDown={() => !busy && setEditing(null)}>
          <form
            className="editor-modal"
            onSubmit={saveProject}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <span className="eyebrow">{editing === "new" ? "Tạo mới" : "Chỉnh sửa"}</span>
                <h2>Thông tin dự án</h2>
              </div>
              <button
                type="button"
                className="icon-button"
                disabled={busy}
                onClick={() => setEditing(null)}
              >
                ×
              </button>
            </div>
            <div className="form-grid">
              <label className="full">
                Tiêu đề
                <input
                  required
                  value={form.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                />
              </label>
              <label className="full">
                Đường dẫn
                <input
                  required
                  value={form.id}
                  onChange={(e) => updateForm("id", slugify(e.target.value))}
                  onFocus={() => !form.id && updateForm("id", slugify(form.title))}
                  placeholder="ten-du-an"
                />
              </label>
              <label>
                Danh mục
                <select
                  value={form.category}
                  onChange={(e) => updateForm("category", e.target.value)}
                >
                  {categories.slice(1).map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label>
                Năm
                <input
                  inputMode="numeric"
                  value={form.year}
                  onChange={(e) => updateForm("year", e.target.value)}
                />
              </label>
              <label>
                Thứ tự
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => updateForm("sortOrder", e.target.value)}
                />
              </label>
              <label>
                Khách hàng
                <input value={form.client} onChange={(e) => updateForm("client", e.target.value)} />
              </label>
              <label className="full">
                Agency
                <input value={form.agency} onChange={(e) => updateForm("agency", e.target.value)} />
              </label>
              <label className="full">
                Vai trò
                <input value={form.role} onChange={(e) => updateForm("role", e.target.value)} />
              </label>
              <label className="full">
                Upload ảnh (JPEG, PNG, WebP, GIF — tối đa 10 MB)
                <input
                  type="file"
                  accept={ALLOWED_IMAGE_TYPES.join(",")}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImageFile(file);
                    if (file && form.thumbnailPath && !removedImagePath) {
                      setRemovedImagePath(form.thumbnailPath);
                    }
                  }}
                />
              </label>
              {imageFile && <p className="admin-file-name full">Ảnh mới: {imageFile.name}</p>}
              {form.image && (
                <div className="admin-image-preview full">
                  <img src={form.image} alt="Ảnh hiện tại" />
                  <span>Ảnh hiện tại</span>
                  <button type="button" className="text-link" onClick={() => replaceImageUrl("")}>
                    Xóa ảnh hiện tại
                  </button>
                </div>
              )}
              <label className="full">
                Hoặc URL ảnh
                <input
                  value={form.image}
                  onChange={(e) => replaceImageUrl(e.target.value)}
                  placeholder="https://..."
                />
              </label>
              <label className="full">
                YouTube URL
                <input
                  value={form.videoUrl}
                  onChange={(e) => updateForm("videoUrl", e.target.value)}
                  placeholder="https://youtu.be/..."
                />
              </label>
              <label className="full">
                Mô tả ngắn
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                />
              </label>
              <label className="full">
                Brief
                <textarea
                  rows="3"
                  value={form.brief}
                  onChange={(e) => updateForm("brief", e.target.value)}
                />
              </label>
              <label className="full">
                Challenge
                <textarea
                  rows="3"
                  value={form.challenge}
                  onChange={(e) => updateForm("challenge", e.target.value)}
                />
              </label>
              <label className="full">
                Approach
                <textarea
                  rows="3"
                  value={form.approach}
                  onChange={(e) => updateForm("approach", e.target.value)}
                />
              </label>
              <label className="full">
                Result
                <textarea
                  rows="3"
                  value={form.result}
                  onChange={(e) => updateForm("result", e.target.value)}
                />
              </label>
              <label className="full">
                Credits
                <textarea
                  rows="3"
                  value={form.credits}
                  onChange={(e) => updateForm("credits", e.target.value)}
                />
              </label>
              <label className="check-field">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => updateForm("featured", e.target.checked)}
                />{" "}
                Nổi bật
              </label>
              <label className="check-field">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => updateForm("published", e.target.checked)}
                />{" "}
                Công khai
              </label>
            </div>
            <div className="modal-actions">
              <button
                className="button button-quiet"
                disabled={busy}
                type="button"
                onClick={() => setEditing(null)}
              >
                Hủy
              </button>
              <button className="button" disabled={busy} type="submit">
                {busy ? "Đang lưu…" : "Lưu dự án"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
