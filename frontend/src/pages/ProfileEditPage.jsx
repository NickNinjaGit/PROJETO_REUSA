import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../Contexts/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmpassword: ''
  });

  const [preview, setPreview] = useState('/images/Default.png');
  const [file, setFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordEdit, setPasswordEdit] = useState(false);
  const [errors, setErrors] = useState({});

  // Atualiza formData e preview quando o usuário estiver carregado
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmpassword: ''
      });
      const imageUrl = user?.image
  ? `http://localhost:5000/images/users/${user.image}`
  : '/images/Default.png';
      setPreview(imageUrl);
    }
  }, [user]);

  const handleEditClick = () => {
    setEditMode(true);
    setPasswordEdit(false);
    setErrors({});
  };

  const handleCancel = () => {
    setEditMode(false);
    setPasswordEdit(false);
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmpassword: ''
      });
      setPreview(user.imageUrl || '/images/Default.png');
    }
    setFile(null);
    setErrors({});
  };

  const handlePasswordEdit = () => setPasswordEdit(true);
  const handleFileClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = 'Email inválido';
    if (passwordEdit) {
      if (!formData.password) newErrors.password = 'Senha é obrigatória';
      if (!formData.confirmpassword) newErrors.confirmpassword = 'Confirmação é obrigatória';
      if (formData.password !== formData.confirmpassword)
        newErrors.confirmpassword = 'Senhas não coincidem';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    if (passwordEdit) {
      data.append('password', formData.password);
      data.append('confirmpassword', formData.confirmpassword);
    }
    if (file) data.append('image', file);

    try {
      const response = await fetch(
        `http://localhost:5000/users/profile/edit/${user.id}`,
        { method: 'PATCH', credentials: 'include', body: data }
      );
      const contentType = response.headers.get('Content-Type');
      let result;
      if (contentType?.includes('application/json')) result = await response.json();
      else throw new Error('Erro no servidor');
      if (!response.ok) throw new Error(result.message || 'Erro');
      setEditMode(false);
      setPasswordEdit(false);
    } catch (error) {
      console.error('Erro:', error.message);
    }
  };

  if (!user) {
    return (
      <div className="container my-5">
        <p className="text-center">Carregando dados do perfil...</p>
      </div>
    );
  }

  return (
    <section className="container my-5" style={{ minHeight: 'calc(100vh - 70px)' }}>
      <div className="row h-100">
        <div className="col-12 col-md-3 mb-4">
          <div className="list-group">
            <button className="list-group-item bg-success text-white fw-bold text-center py-3" disabled>
              Perfil
            </button>
          </div>
        </div>
        <div className="col-12 col-md-9 d-flex">
          <div className="card shadow border-0 flex-fill">
            <div className="card-body d-flex flex-column justify-content-between h-100 w-100">
              {/* Foto e nome/email */}
              <div className="d-flex flex-column flex-md-row align-items-center mb-4">
                <img
                  src={preview}
                  alt="Foto de perfil"
                  className="rounded-circle mb-3 mb-md-0 me-md-4"
                  style={{ width: '120px', height: '120px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={handleFileClick}
                />
                <div className="text-center text-md-start">
                  {editMode ? (
                    <>
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-secondary">Nome de usuário:</label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                        {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-secondary">Email:</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="mb-1 fw-semibold">{formData.name}</h3>
                      <p className="text-muted mb-0">{formData.email}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Detalhes do perfil e senha */}
              {editMode && (
                <div className="mb-4 flex-grow-1 overflow-auto">
                  <h5 className="fw-bold text-success mb-3">Detalhes do Perfil</h5>
                  <button
                    className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1 shadow-sm"
                    onClick={handlePasswordEdit}
                  >
                    Editar Senha
                  </button>
                  <ul className="list-group list-group-flush">
                    {passwordEdit && (
                      <>
                        <li className="list-group-item py-3">
                          <strong>Nova Senha:</strong>
                          <input
                            type="password"
                            name="password"
                            className="form-control mt-2"
                            value={formData.password}
                            onChange={handleInputChange}
                          />
                          {errors.password && <div className="text-danger small">{errors.password}</div>}
                        </li>
                        <li className="list-group-item py-3">
                          <strong>Confirmar Senha:</strong>
                          <input
                            type="password"
                            name="confirmpassword"
                            className="form-control mt-2"
                            value={formData.confirmpassword}
                            onChange={handleInputChange}
                          />
                          {errors.confirmpassword && (
                            <div className="text-danger small">{errors.confirmpassword}</div>
                          )}
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}

              {/* Botões */}
              <div>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                {!editMode ? (
                  <button
                    className="btn btn-success w-100 mb-2 btn-lg shadow-sm rounded-pill"
                    onClick={handleEditClick}
                  >
                    Editar Perfil
                  </button>
                ) : (
                  <>
                    <button className="btn btn-outline-secondary w-100 mb-2 rounded-pill" onClick={handleCancel}>
                      Cancelar
                    </button>
                    <button className="btn btn-success w-100 btn-lg rounded-pill" onClick={handleSave}>
                      Salvar Alterações
                    </button>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
