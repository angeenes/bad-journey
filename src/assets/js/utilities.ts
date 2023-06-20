export class Utilities {

    public createDOMElementFromHTMLString(html) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.firstChild;
      }

}