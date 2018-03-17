import * as fs from 'fs'
export class image {

  public static async load(url: string) {
    return new Promise<HTMLImageElement>(resolve => {
      let img = new Image
      img.src = url
      img.addEventListener('load', e => {
        resolve(img)
      })
    })
  }

  public static async svg(url: string) {
    let div = document.createElement('div')
    div.innerHTML = fs.readFileSync(url).toString()
    return div.firstElementChild as SVGElement
  }

}