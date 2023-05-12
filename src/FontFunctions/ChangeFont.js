/**
 * Function that will override the font of EVERY SINGLE ELEMENT IN THE ENTIRE PROJECT except for with the given ids. A workaround of not having styles we could swap properly with react.
 * @param {*} fontFamilyString The font-family css arguments you want to provide (Should be something like "FontChoice1, Fallback1, FontChoice2, Fallback2, SafeFallBackFont")
 */
export function changeFontOfEverything(fontFamilyString){
    let tag = 0;
    if (document) {
        for (tag of document.getElementsByTagName("*")) {
            if (tag) {
                if (!(tag.id == "fancyFontToggle" || tag.id == "plainFontToggle")) {
                    tag.style.fontFamily = fontFamilyString;
                }
            }
        }
    }
}

/**
    globalFontStylesheet = [...document.styleSheets].find((sheet) =>  [...sheet.cssRules].reduce((rules: String, curRule: CSSRule) => curRule.style ? rules += curRule.style.cssText : "", "").includes("appcss"));
    
    const bodyRule = globalFontStylesheet ? [...globalFontStylesheet.cssRules].find(
        (r) => r.selectorText === "body"): null;
        
    const codeRule = globalFontStylesheet ? [...globalFontStylesheet.cssRules].find(
        (r) => r.selectorText === "code") : null;
    function disableGlobalFont(): void {
        if (bodyRule) {
        bodyRule.style.setProperty("font-family", "appcss, Helvetica, sans-serif");
        }
        if (codeRule) {
        codeRule.style.setProperty("font-family", "appcss, Helvetica, sans-serif");
        }
    }
 */