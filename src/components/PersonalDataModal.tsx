'use client';

import { useState } from 'react';
import { PersonalData } from '@/types/form';
import styles from './PersonalDataModal.module.scss';

interface PersonalDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PersonalData) => void;
}

export default function PersonalDataModal({ isOpen, onClose, onSubmit }: PersonalDataModalProps) {
  const [formData, setFormData] = useState<PersonalData>({
    name: '',
    email: '',
    company: '',
  });

  const [errors, setErrors] = useState<Partial<PersonalData>>({});

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Partial<PersonalData> = {};
    
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (field: keyof PersonalData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Datos de Contacto</h2>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Tu nombre"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">
              Correo Electrónico <span className={styles.required}>*</span>
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="tu@correo.com"
              className={errors.email ? styles.inputError : ''}
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="company">Empresa</label>
            <input
              id="company"
              type="text"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="Nombre de tu empresa"
            />
          </div>

          <div className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitBtn}>
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
