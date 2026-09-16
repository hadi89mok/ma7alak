<style id="ma7alak-mobile-header-alignment-fix">

/* =========================================================
   MA7ALAK PREMIUM HEADER
   MOBILE ALIGNMENT FIX
   ---------------------------------------------------------
   ✓ Keep Ma7alak eye fully inside banner
   ✓ Add safe gap between logo and heart
   ✓ Bring navigation icons closer together
   ✓ Keep icons evenly organized
   ✓ Preserve owner circle
   ✓ Preserve menu button
   ✓ Preserve all existing functions
========================================================= */

@media (max-width:900px){

  /* -------------------------------------------------------
     MAIN HEADER
  ------------------------------------------------------- */
  #ma7alak-social-header{
    grid-template-columns:
      86px
      minmax(0,1fr)
      auto
      auto
      !important;

    column-gap:3px!important;

    padding:
      5px
      7px
      5px
      9px
      !important;

    overflow:visible!important;
  }


  /* -------------------------------------------------------
     LEFT MA7ALAK / EYE LOGO
     Keep the entire artwork INSIDE the rounded banner.
  ------------------------------------------------------- */
  #ma7alak-social-header .ma7alak-header-brand{
    width:86px!important;
    min-width:86px!important;
    max-width:86px!important;

    height:54px!important;

    margin-left:0!important;
    margin-right:2px!important;

    padding:
      2px
      5px
      2px
      3px
      !important;

    display:flex!important;
    align-items:center!important;
    justify-content:center!important;

    overflow:visible!important;

    flex:0 0 86px!important;
  }


  #ma7alak-social-header .ma7alak-header-logo{
    display:block!important;

    width:auto!important;
    height:auto!important;

    max-width:78px!important;
    max-height:50px!important;

    object-fit:contain!important;
    object-position:center!important;

    margin:0 auto!important;

    transform:none!important;
  }


  /* -------------------------------------------------------
     NAVIGATION GROUP
     Compact + organized
  ------------------------------------------------------- */
  #ma7alak-social-header .ma7alak-header-nav{
    min-width:0!important;

    height:48px!important;

    display:flex!important;
    align-items:center!important;
    justify-content:flex-start!important;

    gap:0!important;

    padding:0!important;
    margin:0!important;
  }


  /* -------------------------------------------------------
     NORMAL ICON BUTTONS
  ------------------------------------------------------- */
  #ma7alak-social-header .ma7alak-header-nav-item{
    width:34px!important;
    min-width:34px!important;
    max-width:34px!important;

    height:46px!important;

    flex:0 0 34px!important;

    padding:0!important;
    margin:0!important;

    display:flex!important;
    align-items:center!important;
    justify-content:center!important;

    border-radius:11px!important;
  }


  /* -------------------------------------------------------
     ICON SIZE
  ------------------------------------------------------- */
  #ma7alak-social-header .ma7alak-header-nav-icon{
    width:21px!important;
    height:21px!important;

    display:flex!important;
    align-items:center!important;
    justify-content:center!important;
  }


  #ma7alak-social-header .ma7alak-header-nav-icon svg{
    width:21px!important;
    height:21px!important;

    display:block!important;
  }


  /* -------------------------------------------------------
     HEART + NOTIFICATION SLOTS
  ------------------------------------------------------- */
  #ma7alak-social-header #ma7alak-header-likes-slot,
  #ma7alak-social-header #ma7alak-header-notification-slot{
    width:34px!important;
    min-width:34px!important;
    max-width:34px!important;

    height:46px!important;

    flex:0 0 34px!important;

    padding:0!important;
    margin:0!important;

    display:flex!important;
    align-items:center!important;
    justify-content:center!important;
  }


  /* -------------------------------------------------------
     FOLLOWING ICON
  ------------------------------------------------------- */
  #ma7alak-social-header #ma7alak-header-following{
    width:34px!important;
    min-width:34px!important;
    max-width:34px!important;

    height:46px!important;

    flex:0 0 34px!important;

    padding:0!important;
    margin:0!important;
  }


  /* -------------------------------------------------------
     REAL HEART / BELL BUTTONS
  ------------------------------------------------------- */
  #ma7alak-social-header #ma7alak-story-likes-button,
  #ma7alak-social-header #ma7alak-notification-bell{

    width:32px!important;
    height:32px!important;

    min-width:32px!important;
    min-height:32px!important;

    padding:0!important;
    margin:0!important;

    border-radius:10px!important;
  }


  #ma7alak-social-header #ma7alak-story-likes-icon,
  #ma7alak-social-header #ma7alak-notification-bell-icon{

    width:21px!important;
    height:21px!important;
  }


  /* -------------------------------------------------------
     INSTANT HEART PLACEHOLDER
  ------------------------------------------------------- */
  #ma7alak-social-header #ma7alak-instant-likes-placeholder{

    width:32px!important;
    height:32px!important;

    min-width:32px!important;

    padding:0!important;
    margin:0!important;
  }


  #ma7alak-social-header #ma7alak-instant-likes-placeholder svg{

    width:21px!important;
    height:21px!important;
  }


  /* -------------------------------------------------------
     OWNER / SHOP CIRCLE
  ------------------------------------------------------- */
  #ma7alak-social-header #ma7alak-header-owner.visible{

    width:44px!important;
    min-width:44px!important;

    flex:0 0 44px!important;

    height:48px!important;

    margin:
      0
      4px
      0
      3px
      !important;

    padding:0!important;

    display:flex!important;
    align-items:center!important;
    justify-content:center!important;
  }


  #ma7alak-social-header
  #ma7alak-header-owner
  .ma7alak-owner-avatar-wrap{

    width:40px!important;
    height:40px!important;

    flex:0 0 40px!important;
  }


  /* -------------------------------------------------------
     MENU BUTTON
  ------------------------------------------------------- */
  #ma7alak-social-header #ma7alak-header-menu-button{

    width:38px!important;
    height:38px!important;

    min-width:38px!important;

    flex:0 0 38px!important;

    margin-left:1px!important;
  }

}


/* =========================================================
   NORMAL MOBILE PHONES
========================================================= */

@media (max-width:480px){

  #ma7alak-social-header{

    grid-template-columns:
      82px
      minmax(0,1fr)
      auto
      auto
      !important;

    column-gap:2px!important;

    padding-left:8px!important;
    padding-right:6px!important;
  }


  /* Eye/logo now has breathing room on BOTH sides */
  #ma7alak-social-header .ma7alak-header-brand{

    width:82px!important;
    min-width:82px!important;
    max-width:82px!important;

    flex-basis:82px!important;

    margin-left:0!important;
    margin-right:3px!important;

    padding:
      3px
      6px
      3px
      3px
      !important;
  }


  #ma7alak-social-header .ma7alak-header-logo{

    max-width:72px!important;
    max-height:48px!important;
  }


  /* Compact navigation spacing */
  #ma7alak-social-header .ma7alak-header-nav-item,
  #ma7alak-social-header #ma7alak-header-following,
  #ma7alak-social-header #ma7alak-header-likes-slot,
  #ma7alak-social-header #ma7alak-header-notification-slot{

    width:32px!important;
    min-width:32px!important;
    max-width:32px!important;

    flex-basis:32px!important;
  }


  #ma7alak-social-header .ma7alak-header-nav-icon,
  #ma7alak-social-header .ma7alak-header-nav-icon svg{

    width:20px!important;
    height:20px!important;
  }


  #ma7alak-social-header #ma7alak-header-owner.visible{

    width:42px!important;
    min-width:42px!important;

    flex-basis:42px!important;

    margin-right:3px!important;
    margin-left:2px!important;
  }


  #ma7alak-social-header
  #ma7alak-header-owner
  .ma7alak-owner-avatar-wrap{

    width:39px!important;
    height:39px!important;

    flex-basis:39px!important;
  }


  #ma7alak-social-header #ma7alak-header-menu-button{

    width:37px!important;
    height:37px!important;

    min-width:37px!important;
    flex-basis:37px!important;
  }

}


/* =========================================================
   VERY SMALL PHONES
========================================================= */

@media (max-width:390px){

  #ma7alak-social-header{

    grid-template-columns:
      76px
      minmax(0,1fr)
      auto
      auto
      !important;

    padding-left:7px!important;
    padding-right:5px!important;
  }


  #ma7alak-social-header .ma7alak-header-brand{

    width:76px!important;
    min-width:76px!important;
    max-width:76px!important;

    flex-basis:76px!important;

    margin-left:0!important;
    margin-right:2px!important;
  }


  #ma7alak-social-header .ma7alak-header-logo{

    max-width:68px!important;
    max-height:46px!important;
  }


  #ma7alak-social-header .ma7alak-header-nav-item,
  #ma7alak-social-header #ma7alak-header-following,
  #ma7alak-social-header #ma7alak-header-likes-slot,
  #ma7alak-social-header #ma7alak-header-notification-slot{

    width:30px!important;
    min-width:30px!important;
    max-width:30px!important;

    flex-basis:30px!important;
  }


  #ma7alak-social-header .ma7alak-header-nav-icon,
  #ma7alak-social-header .ma7alak-header-nav-icon svg{

    width:19px!important;
    height:19px!important;
  }


  #ma7alak-social-header #ma7alak-header-owner.visible{

    width:40px!important;
    min-width:40px!important;

    flex-basis:40px!important;

    margin-right:2px!important;
    margin-left:1px!important;
  }


  #ma7alak-social-header
  #ma7alak-header-owner
  .ma7alak-owner-avatar-wrap{

    width:37px!important;
    height:37px!important;

    flex-basis:37px!important;
  }


  #ma7alak-social-header #ma7alak-header-menu-button{

    width:35px!important;
    height:35px!important;

    min-width:35px!important;
    flex-basis:35px!important;
  }

}

</style>
