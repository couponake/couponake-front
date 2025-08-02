import { useRef, useEffect } from "react";

export const useDraggableScroll = () => {
  const ref = useRef<HTMLElement | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);
  const scrollTop = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      startX.current = e.pageX - el.offsetLeft;
      startY.current = e.pageY - el.offsetTop;
      scrollLeft.current = el.scrollLeft;
      scrollTop.current = el.scrollTop;
      el.classList.add("cursor-grabbing");
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const y = e.pageY - el.offsetTop;
      const walkX = (x - startX.current) * 1.5;
      const walkY = (y - startY.current) * 1.5;
      el.scrollLeft = scrollLeft.current - walkX;
      el.scrollTop = scrollTop.current - walkY;
    };

    const onMouseUp = () => {
      isDragging.current = false;
      el.classList.remove("cursor-grabbing");
    };

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseUp);
    el.addEventListener("mouseup", onMouseUp);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseUp);
      el.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return { ref };
};
