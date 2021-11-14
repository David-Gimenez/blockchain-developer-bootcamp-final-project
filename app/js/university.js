function selectMenuOption(menuOptionSelected, contentSelected) {
    const activeMenuOption = document.getElementsByClassName("menuOptionDivClassActive");
    const activeContentOption = document.getElementsByClassName("contentOptionDivAnimationClass");
    const contentSelectedOption = document.getElementById(contentSelected);
    
    activeMenuOption[0].classList.remove("menuOptionDivClassActive");
    activeContentOption[0].classList.remove("contentOptionDivAnimationClass");
    
    menuOptionSelected.classList.add("menuOptionDivClassActive");
    contentSelectedOption.classList.add("contentOptionDivAnimationClass");
}