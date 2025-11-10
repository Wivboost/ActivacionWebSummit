'use client';

import { useState } from 'react';
import { PersonalData } from '@/types/form';
import styles from './PersonalDataModal.module.scss';

interface PersonalDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PersonalData) => void;
}

const COMPANY_STAGES = ['Alpha', 'Beta', 'Growth'];
const MADTECH_SOLUTIONS = ['MadMonitor', 'MadStreet', 'MadSmart', 'MadCreate', 'MadFriday'];

export default function PersonalDataModal({ isOpen, onClose, onSubmit }: PersonalDataModalProps) {
  const [formData, setFormData] = useState<PersonalData>({
    name: '',
    email: '',
    company: '',
    role: '',
    companyStage: '',
    phone: '',
    madtechInterest: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PersonalData, string>>>({});

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    // Allow optional phone, but if provided, should be valid
    if (!phone) return true;
    return /^[\d\s\-\+\(\)]+$/.test(phone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Partial<Record<keyof PersonalData, string>> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
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

  const handleStageToggle = (stage: string) => {
    setFormData(prev => ({
      ...prev,
      companyStage: stage
    }));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Contact Information</h2>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">
              Email <span className={styles.required}>*</span>
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your@email.com"
              className={errors.email ? styles.inputError : ''}
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="company">Company</label>
            <input
              id="company"
              type="text"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="Name de tu empresa"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="role">Rol/Puesto en la Company</label>
            <input
              id="role"
              type="text"
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              placeholder="E.g.: CEO, Marketing Director, etc."
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+52 123 456 7890"
              className={errors.phone ? styles.inputError : ''}
            />
            {errors.phone && <span className={styles.error}>{errors.phone}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Etapa de tu Company</label>
            <div className={styles.checkboxGroup}>
              {COMPANY_STAGES.map(stage => (
                <label key={stage} className={styles.checkboxLabel}>
                  <input
                    type="radio"
                    name="companyStage"
                    checked={formData.companyStage === stage}
                    onChange={() => handleStageToggle(stage)}
                    className={styles.checkbox}
                  />
                  <span>{stage}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="madtechInterest">MadTech Solution of Interest</label>
            <select
              id="madtechInterest"
              value={formData.madtechInterest}
              onChange={(e) => handleChange('madtechInterest', e.target.value)}
            >
              <option value="">Select an option</option>
              {MADTECH_SOLUTIONS.map(solution => (
                <option key={solution} value={solution}>{solution}</option>
              ))}
            </select>
          </div>

          <div className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitBtn}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}