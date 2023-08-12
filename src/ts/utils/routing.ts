import runGL from "./gl/runGL";
import SmoothScroller from "./SelectedScroll";
import { Overview, Selected, About } from "../routes";
import OverviewPageSmoothScroll from "./OverviewScroll";

const routes: { [path: string]: string }  = {
  "/": Overview,
  "/about": About,
  "/selected": Selected
};

const overlayElement = document.querySelector('.overlay') as HTMLDivElement;
const appElement = document.querySelector('#app') as HTMLDivElement;

let listenersAdded = false;

const addLinkListeners = () => {
  document.querySelectorAll('[href^="/"]').forEach(link => 
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = e.target as HTMLAnchorElement;
      const { pathname } = new URL(target.href);
      window.history.pushState({ path: pathname }, pathname, pathname);
      render(pathname);
    })
    );
    
    listenersAdded = true;
  };
  
const render = (path: string) => {
  if (!listenersAdded) {
    addLinkListeners();
  }
  
  setTimeout(() => {
    overlayElement.classList.add('active');
  }, 250);
  appElement.classList.add('fade-out');

  setTimeout(() => {
    appElement.innerHTML = routes[path] || '<h1>Not Found</h1>';
  }, 950);
  
  setTimeout(() => {
    appElement.classList.remove('fade-out');
    overlayElement.classList.remove('active')

    setTimeout(() => {
      const canvas = document.querySelector('#gl') as HTMLCanvasElement
      const overviewPage = document.querySelector('.overview') as HTMLDivElement
      if(canvas){
        runGL()
        new SmoothScroller()
      } else if (overviewPage){
        new OverviewPageSmoothScroll()
      }
    }, 0);
    
  }, 1250);
};

window.addEventListener("popstate", (event) => {
  const path = event.state ? event.state.path : window.location.pathname;
  render(path);
});

render(window.location.pathname);