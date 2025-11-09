'use client';

import { useState } from 'react';
import { FormData, PersonalData, SubmitPayload } from '@/types/form';
import { submitForm, pollResults } from '@/utils/api';
import Header from '@/components/Header';
import CameraCapture from '@/components/CameraCapture';
import PersonalDataModal from '@/components/PersonalDataModal';
import ResultsModal from '@/components/ResultsModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import styles from './page.module.scss';

const INDUSTRIES = [
  'SaaS / Software B2B',
  'Fintech / Servicios Financieros',
  'E-commerce / Retail',
  'Hardware / IoT (Internet de las Cosas)',
  'Recursos Humanos / Talento',
  'Deep Tech / Investigación (IA/ML complejo)',
  'Otro',
];

const IMAGE_STYLES = [
  { value: 'realistic', label: 'Realista/Formal', image: '/create_1.png' },
  { value: 'cartoon', label: 'Caricatura/Ilustración', image: '/Create_2.png' },
  { value: 'anime', label: 'Anime/Sci-Fi', image: '/create_3.png' },
  { value: 'abstract', label: 'Abstracto/Conceptual', image: '/Creative_4.png' },
];

const TONES = [
  'Irónico/Satírico',
  'Chistoso/Relajado',
  'Formal/Directo',
  'Visionario/Inspirador',
];

const CTAS = [
  'Comprar/Contratar',
  'Aprender/Demo',
  'Invertir/Contactar',
  'Unirse al equipo',
];

export default function FormPage() {
  const [formData, setFormData] = useState<FormData>({
    productName: '',
    industry: '',
    imageStyle: '',
    problemStatement: '',
    tone: '',
    cta: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [userPhotoPreview, setUserPhotoPreview] = useState<string>();
  const [logoPhotoPreview, setLogoPhotoPreview] = useState<string>();
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [resultImageUrl, setResultImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleUserPhoto = (file: File) => {
    setFormData(prev => ({ ...prev, userPhoto: file }));
    setUserPhotoPreview(URL.createObjectURL(file));
  };

  const handleLogoPhoto = (file: File) => {
    setFormData(prev => ({ ...prev, logoPhoto: file }));
    setLogoPhotoPreview(URL.createObjectURL(file));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.productName.trim()) {
      newErrors.productName = 'El nombre del producto es requerido';
    }
    if (!formData.industry) {
      newErrors.industry = 'Selecciona una industria';
    }
    if (!formData.imageStyle) {
      newErrors.imageStyle = 'Selecciona un estilo de imagen';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setShowPersonalModal(true);
    }
  };

  const handlePersonalDataSubmit = async (personalData: PersonalData) => {
    setShowPersonalModal(false);
    setIsLoading(true);
    setLoadingMessage('Enviando tu formulario...');
    setLoadingProgress(10);

    try {
      const payload: SubmitPayload = {
        ...formData,
        ...personalData,
      };

      const jobId = await submitForm(payload);
      
      setLoadingMessage('Generando tu anuncio...');
      setLoadingProgress(30);

      const result = await pollResults(jobId, (attempt) => {
        setLoadingProgress(30 + (attempt * 3));
      });

      if (result.status === 'completed' && result.imageUrl) {
        setResultImageUrl(result.imageUrl);
        setShowResultsModal(true);
      } else if (result.status === 'error') {
        alert(`Error: ${result.error || 'Ocurrió un error al procesar tu solicitud'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
      setLoadingProgress(0);
    }
  };

  const handleCreateNew = () => {
    setShowResultsModal(false);
    setFormData({
      productName: '',
      industry: '',
      imageStyle: '',
      problemStatement: '',
      tone: '',
      cta: '',
    });
    setUserPhotoPreview(undefined);
    setLogoPhotoPreview(undefined);
    setResultImageUrl('');
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h1>Crea tu Anuncio Inteligente</h1>
              <p>Responde las preguntas para generar tu anuncio personalizado</p>
            </div>

            <form onSubmit={handleFormSubmit} className={styles.form}>
              {/* Question 1: Product Name */}
              <div className={styles.formGroup}>
                <label htmlFor="productName">
                  1. Nombre de mi Producto/Solución/Empresa <span className={styles.required}>*</span>
                </label>
                <input
                  id="productName"
                  type="text"
                  value={formData.productName}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                  placeholder="Escribe el nombre de tu producto"
                  className={errors.productName ? styles.inputError : ''}
                />
                {errors.productName && <span className={styles.error}>{errors.productName}</span>}
              </div>

              {/* Question 2: Industry */}
              <div className={styles.formGroup}>
                <label htmlFor="industry">
                  2. Giro/Industria principal de mi empresa <span className={styles.required}>*</span>
                </label>
                <select
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className={errors.industry ? styles.inputError : ''}
                >
                  <option value="">Selecciona una opción</option>
                  {INDUSTRIES.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
                {errors.industry && <span className={styles.error}>{errors.industry}</span>}
              </div>

              {/* Question 3: Image Style */}
              <div className={styles.formGroup}>
                <label>
                  3. El estilo de imagen para mi anuncio debe ser <span className={styles.required}>*</span>
                </label>
                <div className={styles.imageStyleGrid}>
                  {IMAGE_STYLES.map(style => (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => handleInputChange('imageStyle', style.value)}
                      className={`${styles.styleCard} ${formData.imageStyle === style.value ? styles.styleCardActive : ''}`}
                    >
                      <div className={styles.styleImage}>
                        <img src={style.image} alt={style.label} />
                      </div>
                      <span className={styles.styleLabel}>{style.label}</span>
                    </button>
                  ))}
                </div>
                {errors.imageStyle && <span className={styles.error}>{errors.imageStyle}</span>}
              </div>

              {/* Question 4: Problem Statement */}
              <div className={styles.formGroup}>
                <label htmlFor="problemStatement">
                  4. ¿Qué PROBLEMA esencial resuelves?
                </label>
                <textarea
                  id="problemStatement"
                  value={formData.problemStatement}
                  onChange={(e) => handleInputChange('problemStatement', e.target.value)}
                  placeholder="Mi empresa resuelve el problema de..."
                  rows={4}
                />
              </div>

              {/* Question 5: Tone */}
              <div className={styles.formGroup}>
                <label htmlFor="tone">5. El TONO que debe tener mi anuncio final es</label>
                <select
                  id="tone"
                  value={formData.tone}
                  onChange={(e) => handleInputChange('tone', e.target.value)}
                >
                  <option value="">Selecciona una opción</option>
                  {TONES.map(tone => (
                    <option key={tone} value={tone}>{tone}</option>
                  ))}
                </select>
              </div>

              {/* Question 6: CTA */}
              <div className={styles.formGroup}>
                <label htmlFor="cta">6. Llamada a la Acción (CTA)</label>
                <select
                  id="cta"
                  value={formData.cta}
                  onChange={(e) => handleInputChange('cta', e.target.value)}
                >
                  <option value="">Selecciona una opción</option>
                  {CTAS.map(cta => (
                    <option key={cta} value={cta}>{cta}</option>
                  ))}
                </select>
              </div>

              {/* Camera Captures */}
              <div className={styles.cameraSection}>
                <h3>Personaliza tu anuncio (opcional)</h3>
                <div className={styles.cameraGrid}>
                  <CameraCapture
                    label="Agregar tu foto"
                    onCapture={handleUserPhoto}
                    capturedImage={userPhotoPreview}
                  />
                  <CameraCapture
                    label="Agregar logo"
                    onCapture={handleLogoPhoto}
                    capturedImage={logoPhotoPreview}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className={styles.submitButton}>
                Generar Anuncio
              </button>
            </form>
          </div>
        </div>
      </main>

      <PersonalDataModal
        isOpen={showPersonalModal}
        onClose={() => setShowPersonalModal(false)}
        onSubmit={handlePersonalDataSubmit}
      />

      <ResultsModal
        isOpen={showResultsModal}
        imageUrl={resultImageUrl}
        onClose={() => setShowResultsModal(false)}
        onCreateNew={handleCreateNew}
      />

      {isLoading && (
        <LoadingSpinner message={loadingMessage} progress={loadingProgress} />
      )}
    </>
  );
}
