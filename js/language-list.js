document.addEventListener("DOMContentLoaded", function() {
    responsiveChangesLang();
    window.addEventListener('resize', responsiveChangesLang);
    var curLangLabels = document.querySelectorAll('[data-theme-lang-label]');
    if(curLangLabels){
        for(var i=0; i<curLangLabels.length; i++){
            curLangLabels[i].addEventListener('click', toggleLangDropdown);
        };
    }
});
function hideLang(){
    var activeLangDropdown = document.querySelector('.theme-lang-dropdown-open');
    activeLangDropdown && activeLangDropdown.classList.remove('theme-lang-dropdown-open');
}
function toggleLangDropdown(e){
    e.target.parentNode.classList.toggle('theme-lang-dropdown-open');
}
function responsiveChangesLang(){
    var langContainer = $D.get('[data-theme-lang-container]');
    var langNonResContainer = $D.get('[data-theme-lang-container-non-res]');
    var langResContainer = $D.get('[data-theme-lang-container-res]');
    if(window.innerWidth < 992 ){
        if(langNonResContainer && langResContainer && langContainer){
            langResContainer.appendChild(langContainer);
        }
    }else{
        if(langNonResContainer && langResContainer && langContainer){
            langNonResContainer.appendChild(langContainer);
        }
    }
}
