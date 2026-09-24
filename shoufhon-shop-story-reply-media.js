/* SHOUFHON SHOP STORY MEDIA REPLIES V1
   Adds photo/video + voice replies to the existing owner-profile Story viewer.
   Uses the global Ma7alakChat Story-media API so replies land in the same chat. */
(function(){
  "use strict";

  if(window.__SHOUFHON_SHOP_STORY_MEDIA_REPLIES_V1__)return;
  window.__SHOUFHON_SHOP_STORY_MEDIA_REPLIES_V1__=true;

  let recorder=null;
  let stream=null;
  let chunks=[];
  let startedAt=0;
  let timer=0;
  let discard=false;
  let busy=false;
  let statusTimer=0;

  function host(){
    try{
      if(window.parent&&window.parent!==window)return window.parent;
    }catch(_){}
    return window;
  }

  function storyId(){
    return String(
      document
        .getElementById("ma7alak-story-shop-name")
        ?.getAttribute("data-story-id")||
      ""
    ).trim();
  }

  function shopSlug(){
    const shell=
      document.getElementById("ma7alak-profile-shell");

    const explicit=
      String(
        shell?.getAttribute("data-shop-slug")||
        ""
      )
        .trim()
        .toLowerCase();

    if(explicit)return explicit;

    try{
      return String(
        window.ShoufHonShopContextClient?.slug||
        ""
      )
        .trim()
        .toLowerCase();
    }catch(_){
      return "";
    }
  }

  function status(message,kind){
    const box=
      document.getElementById(
        "ma7alak-story-reply-status"
      );

    if(!box)return;

    clearTimeout(statusTimer);
    box.classList.remove("success","error","login");
    if(kind)box.classList.add(kind);
    box.textContent=String(message||"");

    if(message){
      statusTimer=
        setTimeout(
          ()=>{
            box.textContent="";
          },
          kind==="login"?5000:2800
        );
    }
  }

  function formatDuration(value){
    const seconds=
      Math.max(
        0,
        Math.round(
          Number(value)||
          0
        )
      );

    return (
      Math.floor(seconds/60)+
      ":"+
      String(seconds%60)
        .padStart(2,"0")
    );
  }

  function mimeBase(value){
    return String(value||"")
      .split(";")[0]
      .trim()
      .toLowerCase();
  }

  function voiceMimeChoice(){
    if(!window.MediaRecorder)return "";

    const choices=[
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/ogg;codecs=opus"
    ];

    for(const choice of choices){
      try{
        if(MediaRecorder.isTypeSupported(choice))return choice;
      }catch(_){}
    }

    return "";
  }

  function pauseStory(){
    document
      .querySelectorAll(
        "#ma7alak-full-story video"
      )
      .forEach(video=>{
        try{
          if(!video.paused){
            video.dataset.m7StoryMediaWasPlaying="1";
            video.pause();
          }
        }catch(_){}
      });
  }

  function resumeStory(){
    const screen=
      document.getElementById(
        "ma7alak-full-story"
      );

    if(
      !screen ||
      !screen.classList.contains("active")
    ){
      return;
    }

    document
      .querySelectorAll(
        "#ma7alak-full-story video[data-m7-story-media-was-playing='1']"
      )
      .forEach(video=>{
        delete video.dataset.m7StoryMediaWasPlaying;
        try{
          const result=video.play();
          result?.catch?.(()=>{});
        }catch(_){}
      });
  }

  function setBusy(value){
    busy=!!value;

    const form=
      document.getElementById(
        "ma7alak-story-reply-form"
      );

    if(!form)return;

    form
      .querySelectorAll(
        ".m7-story-reply-media-btn,#ma7alak-story-reply-send"
      )
      .forEach(button=>{
        button.disabled=busy;
      });
  }

  function cleanupRecorder(){
    clearInterval(timer);
    timer=0;

    try{
      stream
        ?.getTracks()
        ?.forEach(track=>track.stop());
    }catch(_){}

    stream=null;
    recorder=null;
    chunks=[];
    startedAt=0;

    const mic=
      document.querySelector(
        ".m7-story-reply-mic"
      );

    const time=
      document.querySelector(
        ".m7-story-reply-record-time"
      );

    mic?.classList.remove(
      "is-recording"
    );

    if(mic){
      mic.textContent="🎤";
      mic.setAttribute(
        "aria-label",
        "Voice message"
      );
    }

    if(time){
      time.hidden=true;
      time.textContent="0:00";
    }
  }

  async function sendMedia(type,blob,mime,name,duration){
    if(busy)return false;

    const id=storyId();
    const slug=shopSlug();
    const h=host();
    const chat=h.Ma7alakChat;

    if(!id||!slug){
      status(
        "This Story is unavailable.",
        "error"
      );
      return false;
    }

    if(
      !chat ||
      typeof chat.sendStoryMediaReply!=="function"
    ){
      status(
        "Messaging is still loading. Try again.",
        "error"
      );
      return false;
    }

    setBusy(true);
    pauseStory();

    try{
      const result=
        await chat.sendStoryMediaReply({
          story_id:id,
          shop_slug:slug,
          type:type,
          blob:blob,
          mime_type:mime,
          original_name:name,
          duration:duration
        });

      if(result?.ok){
        status(
          type==="voice"
            ? "Voice sent ✓"
            : type==="image"
              ? "Photo sent ✓"
              : "Video sent ✓",
          "success"
        );

        return true;
      }

      if(result?.login_required){
        status(
          "Sign in with Google to send",
          "login"
        );
        return false;
      }

      status(
        result?.error||
        "Could not send reply.",
        "error"
      );

      return false;
    }
    catch(error){
      console.error(
        "Shop Story media reply:",
        error
      );

      status(
        error?.message||
        "Could not send reply.",
        "error"
      );

      return false;
    }
    finally{
      setBusy(false);
      resumeStory();
    }
  }

  async function sendFile(file){
    if(!file)return;

    const mime=mimeBase(file.type);
    let type="";

    if(String(file.type||"").startsWith("image/")){
      type="image";
    }
    else if(
      [
        "video/mp4",
        "video/webm",
        "video/quicktime"
      ].includes(mime)
    ){
      type="video";
    }
    else{
      status(
        "Choose a photo or MP4/WebM/MOV video.",
        "error"
      );
      return;
    }

    if(type==="image"&&file.size>20*1024*1024){
      status(
        "Photo is too large.",
        "error"
      );
      return;
    }

    if(type==="video"&&file.size>25*1024*1024){
      status(
        "Video must be 25 MB or smaller.",
        "error"
      );
      return;
    }

    await sendMedia(
      type,
      file,
      mime,
      file.name||
      type,
      0
    );
  }

  async function startVoice(){
    if(
      busy ||
      recorder?.state==="recording"
    ){
      return;
    }

    const h=host();

    try{
      if(
        h.Ma7alakAccount?.ready
      ){
        await h.Ma7alakAccount.ready();
      }

      if(
        h.Ma7alakAccount &&
        !h.Ma7alakAccount.user
      ){
        h.Ma7alakAccount.open?.();
        status(
          "Sign in with Google to send",
          "login"
        );
        return;
      }
    }catch(_){}

    if(
      !navigator.mediaDevices?.getUserMedia ||
      !window.MediaRecorder
    ){
      status(
        "Voice messages are not supported here.",
        "error"
      );
      return;
    }

    try{
      discard=false;
      chunks=[];

      stream=
        await navigator.mediaDevices.getUserMedia({
          audio:{
            echoCancellation:true,
            noiseSuppression:true,
            autoGainControl:true
          }
        });

      const choice=
        voiceMimeChoice();

      recorder=
        new MediaRecorder(
          stream,
          choice
            ? {
                mimeType:choice,
                audioBitsPerSecond:64000
              }
            : {
                audioBitsPerSecond:64000
              }
        );

      startedAt=Date.now();

      recorder.ondataavailable=
        event=>{
          if(
            event.data &&
            event.data.size
          ){
            chunks.push(
              event.data
            );
          }
        };

      recorder.onstop=
        async ()=>{
          const rec=recorder;

          clearInterval(timer);
          timer=0;

          try{
            stream
              ?.getTracks()
              ?.forEach(track=>track.stop());
          }catch(_){}

          stream=null;
          recorder=null;

          const duration=
            Math.max(
              1,
              (
                Date.now()-
                startedAt
              )/
              1000
            );

          startedAt=0;

          const mime=
            mimeBase(
              rec?.mimeType||
              choice||
              chunks[0]?.type||
              "audio/webm"
            )||
            "audio/webm";

          const blob=
            new Blob(
              chunks,
              {type:mime}
            );

          chunks=[];

          const mic=
            document.querySelector(
              ".m7-story-reply-mic"
            );

          const time=
            document.querySelector(
              ".m7-story-reply-record-time"
            );

          mic?.classList.remove(
            "is-recording"
          );

          if(mic){
            mic.textContent="🎤";
            mic.setAttribute(
              "aria-label",
              "Voice message"
            );
          }

          if(time){
            time.hidden=true;
            time.textContent="0:00";
          }

          if(discard){
            discard=false;
            resumeStory();
            return;
          }

          if(blob.size<700){
            status(
              "Voice message was too short.",
              "error"
            );
            resumeStory();
            return;
          }

          await sendMedia(
            "voice",
            blob,
            mime,
            "voice",
            Number(
              duration.toFixed(2)
            )
          );
        };

      recorder.start(250);
      pauseStory();

      const mic=
        document.querySelector(
          ".m7-story-reply-mic"
        );

      const time=
        document.querySelector(
          ".m7-story-reply-record-time"
        );

      mic?.classList.add(
        "is-recording"
      );

      if(mic){
        mic.textContent="■";
        mic.setAttribute(
          "aria-label",
          "Stop and send voice message"
        );
      }

      if(time){
        time.hidden=false;
        time.textContent="0:00";
      }

      timer=
        setInterval(
          ()=>{
            const seconds=
              Math.max(
                0,
                (
                  Date.now()-
                  startedAt
                )/
                1000
              );

            if(time){
              time.textContent=
                formatDuration(
                  seconds
                );
            }

            if(seconds>=120){
              stopVoice(false);
            }
          },
          250
        );
    }
    catch(error){
      cleanupRecorder();

      console.warn(
        "Shop Story microphone:",
        error
      );

      status(
        "Microphone permission is required.",
        "error"
      );
    }
  }

  function stopVoice(shouldDiscard){
    if(
      !recorder ||
      recorder.state==="inactive"
    ){
      return;
    }

    discard=
      !!shouldDiscard;

    try{
      recorder.stop();
    }
    catch(_){
      cleanupRecorder();
      resumeStory();
    }
  }

  function addStyles(){
    if(
      document.getElementById(
        "m7-story-reply-media-style"
      )
    ){
      return;
    }

    const style=
      document.createElement(
        "style"
      );

    style.id=
      "m7-story-reply-media-style";

    style.textContent=`
      #ma7alak-story-reply-form .m7-story-reply-file{
        display:none!important;
      }

      #ma7alak-story-reply-form .m7-story-reply-media-btn{
        flex:0 0 40px!important;
        width:40px!important;
        height:40px!important;
        min-width:40px!important;
        padding:0!important;
        margin:0!important;
        display:grid!important;
        place-items:center!important;
        border:1px solid rgba(255,255,255,.24)!important;
        border-radius:50%!important;
        background:rgba(13,13,15,.88)!important;
        color:#efbd61!important;
        font:900 18px/1 Arial,sans-serif!important;
        box-shadow:none!important;
        cursor:pointer!important;
        -webkit-tap-highlight-color:transparent!important;
        touch-action:manipulation!important;
      }

      #ma7alak-story-reply-form .m7-story-reply-mic.is-recording{
        color:#fff!important;
        background:#9e211f!important;
        border-color:#ff6b63!important;
        box-shadow:0 0 0 3px rgba(255,61,52,.18)!important;
      }

      #ma7alak-story-reply-form .m7-story-reply-record-time{
        flex:0 0 auto!important;
        min-width:34px!important;
        color:#ffb7b1!important;
        font:900 10px/1 Arial,sans-serif!important;
        text-align:center!important;
      }

      #ma7alak-story-reply-form .m7-story-reply-record-time[hidden]{
        display:none!important;
      }

      @media(max-width:600px){
        #ma7alak-story-reply-form{
          gap:6px!important;
          padding-left:6px!important;
        }

        #ma7alak-story-reply-form .m7-story-reply-media-btn{
          width:38px!important;
          height:38px!important;
          min-width:38px!important;
          flex-basis:38px!important;
        }

        #ma7alak-story-reply-input{
          min-width:72px!important;
          padding-left:8px!important;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  function install(){
    const form=
      document.getElementById(
        "ma7alak-story-reply-form"
      );

    const input=
      document.getElementById(
        "ma7alak-story-reply-input"
      );

    if(
      !form ||
      !input ||
      form.dataset.m7StoryMediaReady==="1"
    ){
      return;
    }

    form.dataset.m7StoryMediaReady="1";
    addStyles();

    const file=
      document.createElement(
        "input"
      );

    file.type="file";
    file.accept=
      "image/*,video/mp4,video/webm,video/quicktime";
    file.className=
      "m7-story-reply-file";

    const media=
      document.createElement(
        "button"
      );

    media.type="button";
    media.className=
      "m7-story-reply-media-btn m7-story-reply-media";
    media.textContent="+";
    media.setAttribute(
      "aria-label",
      "Send photo or video"
    );

    const mic=
      document.createElement(
        "button"
      );

    mic.type="button";
    mic.className=
      "m7-story-reply-media-btn m7-story-reply-mic";
    mic.textContent="🎤";
    mic.setAttribute(
      "aria-label",
      "Voice message"
    );

    const recordTime=
      document.createElement(
        "span"
      );

    recordTime.className=
      "m7-story-reply-record-time";
    recordTime.hidden=true;
    recordTime.textContent="0:00";

    form.insertBefore(
      file,
      input
    );

    form.insertBefore(
      media,
      input
    );

    form.insertBefore(
      mic,
      input
    );

    form.insertBefore(
      recordTime,
      input
    );

    media.onclick=
      event=>{
        event.preventDefault();
        event.stopPropagation();

        if(
          busy ||
          recorder?.state==="recording"
        ){
          return;
        }

        file.click();
      };

    file.onchange=
      async ()=>{
        const chosen=
          file.files?.[0]||
          null;

        file.value="";

        if(chosen){
          await sendFile(chosen);
        }
      };

    mic.onclick=
      async event=>{
        event.preventDefault();
        event.stopPropagation();

        if(busy)return;

        if(
          recorder?.state==="recording"
        ){
          stopVoice(false);
        }
        else{
          await startVoice();
        }
      };

    const screen=
      document.getElementById(
        "ma7alak-full-story"
      );

    if(screen){
      const observer=
        new MutationObserver(
          ()=>{
            if(
              recorder?.state==="recording" &&
              !screen.classList.contains("active")
            ){
              stopVoice(true);
            }
          }
        );

      observer.observe(
        screen,
        {
          attributes:true,
          attributeFilter:["class"]
        }
      );
    }
  }

  install();

  const observer=
    new MutationObserver(
      install
    );

  observer.observe(
    document.documentElement,
    {
      childList:true,
      subtree:true
    }
  );

  window.addEventListener(
    "pagehide",
    ()=>{
      if(
        recorder?.state==="recording"
      ){
        stopVoice(true);
      }
      else{
        cleanupRecorder();
      }
    }
  );
})();