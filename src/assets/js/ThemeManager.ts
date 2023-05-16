export class ThemeManager {
  constructor() {
    this.updateTheme();
  }

  updateTheme(): void {
    const isDark = localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Pour choisir explicitement le mode clair
  setLightTheme(): void {
    localStorage.theme = 'light';
    this.updateTheme();
  }

  // Pour choisir explicitement le mode sombre
  setDarkTheme(): void {
    localStorage.theme = 'dark';
    this.updateTheme();
  }

  // Pour choisir explicitement de respecter la préférence du système d'exploitation
  respectOSPreference(): void {
    localStorage.removeItem('theme');
    this.updateTheme();
  }

  switchTheme(): void {
    const currentTheme = localStorage.theme;
    if (currentTheme === 'light') {
      this.setDarkTheme();
    } else {
      this.setLightTheme();
    }
  }

}

// Initialisation :
// const themeManager = new ThemeManager();

// // Utilisation :

// // Pour choisir explicitement le mode clair
// themeManager.setLightTheme();

// // Pour choisir explicitement le mode sombre
// themeManager.setDarkTheme();

// // Pour choisir explicitement de respecter la préférence du système d'exploitation
// themeManager.respectOSPreference();
