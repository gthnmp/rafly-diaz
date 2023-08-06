class SmoothScroller {
  current: number;
  target: number;
  isDragging: boolean;
  startY: number;
  ease: number;
  selectionHeader: HTMLHeadElement;
  itemWidth: HTMLDivElement;
  maximumX: number;

  constructor() {
    this.current = 0;
    this.target = 0;
    this.isDragging = false;
    this.startY = 0;
    this.ease = 0.075;

    this.selectionHeader = document.querySelector('.selection > header')!;
    this.itemWidth = document.querySelector('.selection > header > .item-container')!;
    this.maximumX = parseFloat(getComputedStyle(this.selectionHeader).width) - parseFloat(getComputedStyle(this.itemWidth).width);

    this.smoothScroll = this.smoothScroll.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);

    this.init();
  }

  lerp(start: number, end: number, t: number) {
    return start * (1 - t) + (end * t);
  }

  setTransform(element: HTMLElement | null, change: string) {
    if (element) {
      element.style.transform = change;
    }
  }

  smoothScroll() {
    this.current = this.lerp(this.current, this.target, this.ease);
    this.current = parseFloat(this.current.toFixed(2));
    this.setTransform(this.selectionHeader, `translate3d(${-this.current}px, 0 ,0)`);
    requestAnimationFrame(this.smoothScroll);
  }

  handleWheel(e: WheelEvent) {
    e.preventDefault();
    this.target = Math.min(this.maximumX, Math.max(0, this.target + e.deltaY * 1.5));
  }

  handleMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.startY = event.clientX;
    document.body.style.cursor = 'grabbing';
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    const deltaY = event.clientX - this.startY;
    this.target = Math.min(this.maximumX, Math.max(0, this.target - deltaY * 2.5));
    this.startY = event.clientX;
  }

  handleMouseUp() {
    this.isDragging = false;
    document.body.style.cursor = 'default';
  }

  handleTouchStart(event: TouchEvent) {
    this.isDragging = true;
    this.startY = event.touches[0].clientX;
  }

  handleTouchMove(event: TouchEvent) {
    if (!this.isDragging) return;
    const deltaY = event.touches[0].clientX - this.startY;
    this.target = Math.min(this.maximumX, Math.max(0, this.target - deltaY * 2.5));
    this.startY = event.touches[0].clientX;
  }

  handleTouchEnd() {
    this.isDragging = false;
  }

  init() {
    this.smoothScroll();
    window.addEventListener('wheel', this.handleWheel, { passive: false });
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('touchstart', this.handleTouchStart);
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleTouchEnd);
  }
}

const observer = new MutationObserver(() => {
  new SmoothScroller();
  const projectThumbnails = document.querySelectorAll('.selection.item-thumbnail')
  const mainImageThumbnail:HTMLImageElement = document.querySelector('.main-image')!

  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        console.log(entry.target.getAttribute('src'));
        mainImageThumbnail.src = entry.target.getAttribute('src')!
      }
    })
  }, {
    threshold: 0, 
    rootMargin: `0px -100% 0px 1px`,
  })

  projectThumbnails.forEach(thumbnail => {
    intersectionObserver.observe(thumbnail)
  })

});

observer.observe(document.body, { childList: true, subtree: true });

new SmoothScroller();
