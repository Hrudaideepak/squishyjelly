/* ============================================================
   main.js — Global Museum Logic
   ============================================================ */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initReveals();
});

/**
 * Handles navigation bar scroll effects
 */
function initNav() {
  const nav = document.querySelector(".main-nav");
  if (!nav || nav.hasAttribute('data-no-toggle')) return;

  // Mobile Toggle Logic
  const toggle = document.createElement("button");
  toggle.className = "nav-toggle";
  toggle.setAttribute("aria-label", "Toggle menu");
  toggle.innerHTML = "<span>☰</span>"; // Simple hamburger icon
  nav.appendChild(toggle);

  const navLinks = document.querySelector(".nav-links");

  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    toggle.innerHTML = navLinks.classList.contains("active") ? "✕" : "☰";
  });

  // Close menu when link is clicked
  const links = navLinks.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      toggle.innerHTML = "☰";
    });
  });

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 50) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    },
    { passive: true },
  );

  // Highlight active nav link
  const currentPath = window.location.pathname;
  const allLinks = document.querySelectorAll(".nav-links a");
  allLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPath.split("/").pop()) {
      link.classList.add("active");
    }
  });
}

/**
 * Intersection Observer for scroll-reveal animations
 */
function initReveals() {
  const reveals = document.querySelectorAll(".reveal");
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  reveals.forEach((el) => observer.observe(el));
}

/**
 * Global utility for URL parameters
 */
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}
