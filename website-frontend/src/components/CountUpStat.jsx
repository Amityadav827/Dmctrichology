"use client";
import React, { useState, useEffect, useRef } from 'react';

const CountUpStat = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const countRef = useRef(null);
  const hasAnimated = useRef(false);

  // Parse value
  const isK = value.toString().toLowerCase().includes('k');
  const isPlus = value.toString().includes('+');
  const numericValue = parseFloat(value.toString().replace(/[k+]/gi, '')) * (isK ? 1000 : 1);
  const isDecimal = value.toString().includes('.');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing: ease-out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = easeOut * numericValue;
      
      setCount(currentCount);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [isVisible, numericValue, duration]);

  const formatValue = (val) => {
    if (isK && val >= 1000) {
      return (val / 1000).toFixed(val % 1000 === 0 ? 0 : 1) + 'k';
    }
    if (isDecimal) {
      return val.toFixed(1);
    }
    return Math.floor(val).toString();
  };

  return (
    <span ref={countRef}>
      {formatValue(count)}{isPlus ? '+' : ''}
    </span>
  );
};

export default CountUpStat;
