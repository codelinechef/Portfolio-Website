import ReactGA from 'react-ga4';

const MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your Google Analytics 4 Measurement ID

export const initAnalytics = () => {
  if (typeof window !== 'undefined') {
    ReactGA.initialize(MEASUREMENT_ID, {
      gaOptions: {
        cookieFlags: 'SameSite=None;Secure',
      },
    });
  }
};

export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

export const trackButtonClick = (buttonName: string, location: string) => {
  trackEvent('User Interaction', 'Button Click', `${buttonName} - ${location}`);
};

export const trackNavigation = (destination: string) => {
  trackEvent('Navigation', 'Link Click', destination);
};

export const trackProjectView = (projectName: string) => {
  trackEvent('Projects', 'View Project', projectName);
};

export const trackFormSubmission = (formName: string, success: boolean) => {
  trackEvent('Forms', success ? 'Submit Success' : 'Submit Error', formName);
};

export const trackDownload = (fileName: string) => {
  trackEvent('Downloads', 'File Download', fileName);
};