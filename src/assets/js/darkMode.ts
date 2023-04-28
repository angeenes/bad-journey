export class ThemeManager {
    private readonly DARK_CLASS = 'dark';
    private readonly MEDIA_QUERY = '(prefers-color-scheme: dark)';
    private readonly LOCAL_STORAGE_KEY = 'theme';
  
    constructor() {
      this.initialize();
    }
  
    initialize(): void {
      this.logDarkMode()
      if (localStorage.getItem(this.LOCAL_STORAGE_KEY) === 'dark' ||
        (!localStorage.getItem(this.LOCAL_STORAGE_KEY) && window.matchMedia(this.MEDIA_QUERY).matches)) {
        document.documentElement.classList.add(this.DARK_CLASS);
      } else {
        document.documentElement.classList.remove(this.DARK_CLASS);
      }
    }
  
    setLightMode(): void {
      localStorage.setItem(this.LOCAL_STORAGE_KEY, 'light');
    }
  
    setDarkMode(): void {
      localStorage.setItem(this.LOCAL_STORAGE_KEY, 'dark');
    }
  
    respectOsPreference(): void {
      localStorage.removeItem(this.LOCAL_STORAGE_KEY);
    }
  
    logDarkMode(): void {
      console.log('mode sombre');
    }
  }
  
//   const themeManager = new ThemeManager();
  