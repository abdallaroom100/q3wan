import React from 'react';
import styles from '../pages/SignFamily/SignFamily.module.css';

interface ProgressStepsProps {
  step: number;
  steps: string[];
  isMobile: boolean;
  stepIcons: React.ReactElement[];
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ step, steps, isMobile, stepIcons }) => {
  if (isMobile) {
    return (
      <div className="mb-6" style={{ textAlign: 'center' }}>
        <div className={styles.progressStepsHorizontal} style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          {steps.map((label, idx) => (
            <React.Fragment key={label}>
              <div className={styles.progressStepHorizontal} style={{ transform: 'scale(0.8)' }}>
                <div
                  className={
                    styles.progressCircle +
                    (step > idx + 1 ? ' ' + styles.completed : step === idx + 1 ? ' ' + styles.active : '')
                  }
                  style={{ width: '35px', height: '35px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {step > idx + 1 ? (
                    <span>&#10003;</span>
                  ) : (
                    <span style={{ transform: 'scale(1.3)', display: 'inline-flex' }}>{stepIcons[idx]}</span>
                  )}
                </div>
                <span className={styles.stepLabel} style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>{label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={
                    styles.stepConnectorHorizontal +
                    (step > idx + 1 ? ' ' + styles.completed : '')
                  }
                  style={{ width: '30px' }}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }
  // Desktop (vertical)
  return (
    <div className={styles.progressSteps} style={{ height: '100%', justifyContent: 'flex-start', gap: '1.5rem' }}>
      {steps.map((label, idx) => (
        <React.Fragment key={label}>
          <div className={styles.progressStep} style={{ transform: 'scale(1.1)' }}>
            <div
              className={
                styles.progressCircle +
                (step > idx + 1 ? ' ' + styles.completed : step === idx + 1 ? ' ' + styles.active : '')
              }
              style={{ width: '45px', height: '45px', fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {step > idx + 1 ? (
                <span>&#10003;</span>
              ) : (
                <span style={{ transform: 'scale(1.3)', display: 'inline-flex' }}>{stepIcons[idx]}</span>
              )}
            </div>
            <span className={styles.stepLabel} style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>{label}</span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={
                styles.stepConnector +
                (step > idx + 1 ? ' ' + styles.completed : '')
              }
              style={{ height: '50px' }}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressSteps; 