import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "remixicon/fonts/remixicon.css";

gsap.registerPlugin(ScrollTrigger);

function App() {
  let [showContent, setShowContent] = useState(false);
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.35;
    audio.play().catch(() => {});

    const enableSound = () => {
      audio.muted = false;
      setIsMuted(false);
      audio.play().catch(() => {});
      window.removeEventListener("pointerdown", enableSound);
      window.removeEventListener("keydown", enableSound);
    };

    window.addEventListener("pointerdown", enableSound, { once: true });
    window.addEventListener("keydown", enableSound, { once: true });

    return () => {
      window.removeEventListener("pointerdown", enableSound);
      window.removeEventListener("keydown", enableSound);
    };
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.muted = false;
      setIsMuted(false);
      audio.play().catch(() => {});
      return;
    }

    const nextMuted = !audio.muted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const scrollToStory = () => {
    document.querySelector("#story")?.scrollIntoView({ behavior: "smooth" });
  };
  const revealImage = (event, options = {}) => {
    gsap.fromTo(
      event.currentTarget,
      {
        opacity: 0,
        scale: 0.94,
        y: 18,
        filter: "blur(10px)",
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.1,
        ease: "power3.out",
        ...options,
      },
    );
  };
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.to(".vi-mask-group", {
      rotate: 10,
      duration: 2,
      ease: "Power4.easeInOut",
      transformOrigin: "50% 50%",
    }).to(".vi-mask-group", {
      scale: 10,
      duration: 2,
      delay: -1.8,
      ease: "Expo.easeInOut",
      transformOrigin: "50% 50%",
      opacity: 0,
      onUpdate: function () {
        if (this.progress() >= 0.9) {
          document.querySelector(".svg").remove();
          setShowContent(true);
          this.kill();
        }
      },
    });
  });
  useGSAP(() => {
    if (!showContent) return;
    gsap.to(".main", {
      scale: 1,
      rotate: 0,
      duration: 2,
      delay: "-1",
      ease: "Expo.easeInOut",
    });
    gsap.to(".sky", {
      scale: 1.1,
      rotate: 0,
      duration: 2,
      delay: "-.8",
      ease: "Expo.easeInOut",
    });
    gsap.to(".bg", {
      scale: 1.1,
      rotate: 0,
      duration: 2,
      delay: "-.8",
      ease: "Expo.easeInOut",
    });
    gsap.to(".character", {
      scale: 1,
      x: "-50%",
      bottom: "0%",
      rotate: 0,
      duration: 2,
      delay: "-.8",
      ease: "Expo.easeInOut",
    });
    gsap.to(".text", {
      scale: 1,
      rotate: 0,
      duration: 2,
      delay: "-.8",
      ease: "Expo.easeInOut",
    });

    const storyTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#story",
        start: "top 72%",
        once: true,
      },
    });

    storyTimeline
      .from(".limg-main", {
        x: -160,
        y: 50,
        opacity: 0,
        scale: 0.82,
        duration: 1.5,
        ease: "power3.out",
      })
      .from(
        "#story .story-title",
        {
          x: 90,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
        },
        "-=1.1",
      )
      .from(
        "#story .story-copy",
        {
          y: 35,
          opacity: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: "power2.out",
        },
        "-=0.65",
      );

    gsap.to(".limg-main", {
      y: -14,
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1.6,
    });

    gsap.to(".limg-main", {
      yPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: "#story",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2,
      },
    });

    const main = document.querySelector(".main");
    const handleMouseMove = (e) => {
      const xMove = (e.clientX / window.innerWidth - 0.5) * 40;
      gsap.to(".main .text", {
        x: `${xMove * 0.4}%`,
      });
      gsap.to(".sky", {
        x: xMove,
      });
      gsap.to(".bg", {
        x: xMove * 1.7,
      });
    };
    main?.addEventListener("mousemove", handleMouseMove);
    return () => {
      main?.removeEventListener("mousemove", handleMouseMove);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [showContent]);
  return (
    <>
      <audio
        ref={audioRef}
        src="/lofi-beats.mp3"
        loop
        muted
        preload="auto"
        aria-label="Background music"
      />
      <button
        type="button"
        className="music-control fixed right-5 top-5 z-[90] flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-md"
        onClick={toggleMusic}
        aria-label={isMuted ? "Play music" : "Mute music"}
        title={isMuted ? "Play music" : "Mute music"}
      >
        <i className={isMuted ? "ri-volume-mute-fill" : "ri-volume-up-fill"}></i>
      </button>
      <div className="svg flex items-center justify-center fixed top-0 left-0 z-[100] w-full h-screen overflow-hidden bg-[#000]">
        <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <mask id="viMask">
              <rect width="100%" height="100%" fill="black" />
              <g className="vi-mask-group">
                <text
                  x="50%"
                  y="50%"
                  fontSize="250"
                  textAnchor="middle"
                  fill="white"
                  dominantBaseline="middle"
                  fontFamily="Arial Black"
                >
                  VI
                </text>
              </g>
            </mask>
          </defs>
          <image
            href="/bg.png.png"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#viMask)"
            onLoad={(event) => revealImage(event, { delay: 0.1 })}
          />
        </svg>
      </div>
      {showContent && (
        <div className="main w-full">
          <div className="landing overflow-hidden relative w-full h-[100svh] min-h-[640px] bg-black">
            <div className="navbar absolute top-0 left-0 z-[10] w-full py-10 px-10">
              <div className="logo flex gap-7">
                <div className="lines flex flex-col gap-[5px]">
                  <div className="line w-15 h-2 bg-white"></div>
                  <div className="line w-8 h-2 bg-white"></div>
                  <div className="line w-5 h-2 bg-white"></div>
                </div>
                <img
                  className="h-10 w-auto object-contain"
                  src="/logo18.png"
                  alt="Rockstar Games"
                  onLoad={(event) => revealImage(event, { delay: 0.25 })}
                />
              </div>
            </div>
            <div className="imagesdiv relative overflow-hidden w-full h-screen">
              <img
                className="absolute sky scale-[1.08] top-0 left-0 w-full h-full object-cover"
                src="/sky.png"
                alt="Blue anime sky"
                onLoad={(event) => revealImage(event, { delay: 0.35 })}
              />
              <img
                className="absolute scale-[1.08] bg top-0 left-0 w-full h-full object-cover"
                src="/bg.png.png"
                alt="Palm-lined city street"
                onLoad={(event) => revealImage(event, { delay: 0.45 })}
              />
              <div className="text text-white absolute z-[2] top-[19%] left-1/2 -translate-x-1/2 flex flex-col items-center">
                <h1 className="hero-word hero-word-one">grand</h1>
                <h1 className="hero-word hero-word-two">theft</h1>
                <h1 className="hero-word hero-word-three">auto</h1>
              </div>
              <img
                className="absolute z-[3] character bottom-0 left-1/2 -translate-x-1/2 h-[72%] max-h-[760px] w-auto max-w-[72%] object-contain object-bottom"
                src="/girlbg.png"
                alt="Anime character"
                onLoad={(event) => revealImage(event, { delay: 0.65 })}
              />
            </div>
            <button
              type="button"
              className="btmbar text-white absolute bottom-0 left-0 z-[4] w-full py-15 px-10 bg-gradient-to-t from-black to-transparent text-left"
              onClick={scrollToStory}
              aria-label="Scroll to story"
            >
              <div className="flex gap-4 items-center">
                <i className="text-4xl ri-arrow-down-line"></i>
                <h3 className="text-xl font-[Helvetica_Now_Display]">
                  Scroll Down
                </h3>
              </div>
              <img
                className="absolute h-[55px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                src="/ps5.png"
                alt="Available on PlayStation 5 and Xbox Series X|S"
                onLoad={(event) => revealImage(event, { delay: 0.85 })}
              />
            </button>
          </div>
          <div id="story" className="story-section w-full min-h-[100svh] flex items-center justify-center bg-black px-6 py-20">
            <div className="cntnr flex items-center gap-12 text-white w-full max-w-[1500px] mx-auto">
              <div className="limg relative w-1/2 h-[70vh] min-h-[520px]">
                <img
                  className="limg-main absolute inset-0 m-auto h-full w-full object-contain"
                  src="/imag.png"
                  alt="Vice City anime character"
                  onLoad={(event) => revealImage(event, { delay: 0.1 })}
                />
              </div>
              <div className="rg w-[46%] max-w-[650px]">
                <h1 className="story-title">Welcome to</h1>
                <h1 className="story-title">Vice City</h1>
                <p className="story-copy mt-8 text-lg leading-relaxed text-white/75">
                  Vice City is a neon-soaked playground of opportunity, danger,
                  and ambition. Between sunlit beaches and shadowy backstreets,
                  every decision can open a new route forward.
                </p>
                <p className="story-copy mt-3 text-xl font-[Helvetica_Now_Display]">
                  Join Lucia and Jason as they chase freedom through a city ruled
                  by rival crews, powerful fortunes, and unforgiving loyalties.
                  Trust is earned, plans change fast, and the next score could
                  change everything.
                </p>
                <p className="story-copy mt-10 text-xl font-[Helvetica_Now_Display]">
                  Explore the streets, build your reputation, and make your own
                  way across the most vibrant and dangerous state in the series.
                </p>
                <button className="bg-yellow-500 px-10 py-10 text-black mt-10 text-4xl">
                  Download Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default App;


