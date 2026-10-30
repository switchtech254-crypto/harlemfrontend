"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Position state for an infinitely looping slide track.
 * The track renders `count + 1` items (one extra clone of the first slide).
 * Reaching the clone plays the normal animation, then silently snaps back to 0,
 * so the motion always continues in the same direction.
 */
export function useSlideLoop(count: number, duration: number) {
  const [pos, setPos] = useState(0);
  const [animate, setAnimate] = useState(true);
  const pending = useRef<number | null>(null);

  // Landed on the clone: once the animation has finished, jump to the real first slide.
  useEffect(() => {
    if (count < 2 || pos !== count) return;
    const t = setTimeout(() => {
      setAnimate(false);
      setPos(0);
    }, duration);
    return () => clearTimeout(t);
  }, [pos, count, duration]);

  // After an instant jump, turn transitions back on once the new position has painted.
  useEffect(() => {
    if (animate) return;
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => {
        setAnimate(true);
        if (pending.current !== null) {
          setPos(pending.current);
          pending.current = null;
        }
      });
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [animate]);

  const next = useCallback(() => {
    if (count < 2 || !animate || pos >= count) return;
    setPos(pos + 1);
  }, [count, animate, pos]);

  const prev = useCallback(() => {
    if (count < 2 || !animate) return;
    if (pos === 0) {
      // Jump (invisibly) to the clone, then slide back to the last real slide.
      pending.current = count - 1;
      setAnimate(false);
      setPos(count);
    } else {
      setPos(pos - 1);
    }
  }, [count, animate, pos]);

  const goTo = useCallback(
    (index: number) => {
      if (animate && index >= 0 && index < count) setPos(index);
    },
    [animate, count],
  );

  return {
    pos,
    animate,
    active: count > 0 ? pos % count : 0, // the clone counts as slide 0
    next,
    prev,
    goTo,
  };
}