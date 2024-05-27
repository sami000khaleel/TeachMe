import Cookies from 'js-cookies'
/**
 * Sets the theme based on the user's preferred color scheme and stores it in a cookie.
 * @param {Function} setTheme - A function that sets the theme of the application.
 */
export function handleThemeInit(setTheme) {
    let isDarkMode=false
    if(Cookies.getItem('theme'))
            {
                isDarkMode=Cookies.getItem('theme')==='dark'?true:false
                isDarkMode?document.documentElement.classList.add('dark'):document.documentElement.classList.remove('dark')
                isDarkMode?setTheme('dark'):setTheme('light')
                isDarkMode?Cookies.setItem('theme','dark'):Cookies.setItem('theme','light')

                return
            }
   isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  console.log(isDarkMode)
  const theme = isDarkMode ? 'dark' : 'light';
  console.log(theme)
  setTheme(theme);
  Cookies.setItem('theme', theme);
  isDarkMode?document.documentElement.classList.add('dark'):document.documentElement.classList.remove('dark')

}
   export function handleThemeChange(setTheme){
    return e=>{

        const theme=Cookies.getItem('theme')
        if(theme==='dark'){
            setTheme('light')
            Cookies.setItem('theme','light')
            document.documentElement.classList.remove('dark')
            return
        }
        if(theme==='light'){
            setTheme('dark')
            Cookies.setItem('theme','dark')
            document.documentElement.classList.add('dark')
            return
        }
    }
    }
    export function dateTrimmer(date) {
    
        if(!date)
            return date
        if (date.includes("T")) return date.split("T")[0];
            return date;
      }