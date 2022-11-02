document.addEventListener("DOMContentLoaded", function(event) {
    if(window.innerWidth < 992 ){
        var langNonResContainer = $D.get('[data-theme-lang-container]');
        var langResContainer = $D.get('[data-theme-lang-container-res]');
        if(langNonResContainer && langResContainer){
            langResContainer.appendChild(langNonResContainer);
        }
    }
    var curLangLabels = document.querySelectorAll('[data-theme-lang-label]');
    if(curLangLabels){
        for(var i=0; i<curLangLabels.length; i++){
            curLangLabels[i].addEventListener('click', toggleLangDropdown);
        };
    }
});
function hideLang(){
    var activeLangDropdown = document.querySelector('.theme-lang-dropdown-open');
    activeLangDropdown.classList.remove('theme-lang-dropdown-open');
}
function toggleLangDropdown(e){
    e.target.parentNode.classList.toggle('theme-lang-dropdown-open');
}
