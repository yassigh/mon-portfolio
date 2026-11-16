/* ==========================================================================
   PORTFOLIO YASSINE GHARBI — SCRIPT JAVASCRIPT MODERNE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. DÉFILEMENT FLUIDE (SMOOTH SCROLL)
       ---------------------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                e.preventDefault();
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Fermer le menu mobile si ouvert
                closeMobileMenu();
            }
        });
    });

    /* ----------------------------------------------------------------------
       2. BARRE DE PROGRESSION & NAVBAR ACTIVE STATE TRACKING
       ---------------------------------------------------------------------- */
    const progressBar = document.getElementById('scrollProgressBar');
    const navbarPill = document.querySelector('.navbar-pill');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.pill-nav a, .mobile-dropdown nav a');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        // Mise à jour de la barre de progression
        if (progressBar && docHeight > 0) {
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }

        // Effet de fond sur la navbar
        if (navbarPill) {
            if (scrollTop > 40) {
                navbarPill.style.background = 'rgba(11, 16, 28, 0.94)';
                navbarPill.style.boxShadow = '0 14px 40px rgba(0, 0, 0, 0.65)';
            } else {
                navbarPill.style.background = 'rgba(11, 16, 28, 0.82)';
                navbarPill.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.55)';
            }
        }

        // Bouton retour en haut
        if (scrollToTopBtn) {
            if (scrollTop > 350) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }

        // Détection de section active (Scrollspy)
        let currentSectionId = '';
        const scrollPosition = scrollTop + 160;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // Clic sur le bouton retour en haut
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ----------------------------------------------------------------------
       3. FILTRAGE INTERACTIF DES PROJETS (RECRUTEUR VIEW)
       ---------------------------------------------------------------------- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Activer le bouton cliqué
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category') || '';
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px) scale(0.96)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });

    /* ----------------------------------------------------------------------
       4. COPIE DE L'ADRESSE EMAIL DANS LE PRESSE-PAPIER + TOAST
       ---------------------------------------------------------------------- */
    const emailCopyCard = document.getElementById('emailCopyCard');
    const copyToast = document.getElementById('copyToast');
    const copyBadge = document.getElementById('copyBadge');

    function copyEmailToClipboard(emailText) {
        navigator.clipboard.writeText(emailText).then(() => {
            // Afficher le toast notification
            if (copyToast) {
                copyToast.classList.add('active');
                setTimeout(() => {
                    copyToast.classList.remove('active');
                }, 3200);
            }

            // Mettre à jour le badge de la carte
            if (copyBadge) {
                const originalHtml = copyBadge.innerHTML;
                copyBadge.innerHTML = '<i class="fa-solid fa-check"></i> Adresse copiée !';
                copyBadge.style.color = '#10b981';
                setTimeout(() => {
                    copyBadge.innerHTML = originalHtml;
                    copyBadge.style.color = '';
                }, 2500);
            }
        }).catch(err => {
            console.warn('Impossible de copier automatiquement :', err);
        });
    }

    if (emailCopyCard) {
        emailCopyCard.addEventListener('click', () => {
            copyEmailToClipboard('yassinegharbi158@gmail.com');
        });
    }

    /* ----------------------------------------------------------------------
       5. SOUMISSION DU FORMULAIRE DE CONTACT (AJAX + FEEDBACK)
       ---------------------------------------------------------------------- */
    const contactForm = document.getElementById('mainContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = document.getElementById('submitBtn');
            const originalBtnHtml = submitBtn.innerHTML;

            // En mode local direct (file://) : fallback vers messagerie client
            if (window.location.protocol === 'file:') {
                const name = encodeURIComponent(contactForm.querySelector('#form-name').value);
                const subject = encodeURIComponent(contactForm.querySelector('#form-subject').value);
                const message = encodeURIComponent(contactForm.querySelector('#form-message').value);
                
                alert("Envoi en mode local : ouverture de votre application de messagerie.");
                window.location.href = `mailto:yassinegharbi158@gmail.com?subject=${subject}&body=Nom: ${name}%0D%0A%0D%0A${message}`;
                return;
            }

            // Animation bouton en cours d'envoi
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours...';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch("https://formsubmit.co/ajax/yassinegharbi158@gmail.com", {
                    method: "POST",
                    headers: { 
                        'Accept': 'application/json'
                    },
                    body: formData
                });

                if (response.ok) {
                    submitBtn.style.background = "#10b981";
                    submitBtn.style.borderColor = "#10b981";
                    submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message envoyé avec succès !';
                    contactForm.reset();
                    
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.style.background = "";
                        submitBtn.style.borderColor = "";
                        submitBtn.innerHTML = originalBtnHtml;
                    }, 4500);
                } else {
                    throw new Error("Erreur de transmission");
                }
            } catch (error) {
                submitBtn.style.background = "#ef4444";
                submitBtn.style.borderColor = "#ef4444";
                submitBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Erreur lors de l\'envoi';
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.style.background = "";
                    submitBtn.style.borderColor = "";
                    submitBtn.innerHTML = originalBtnHtml;
                }, 3500);
            }
        });
    }

});

/* --------------------------------------------------------------------------
   6. GESTION DU MENU MOBILE (DROPDOWN)
   -------------------------------------------------------------------------- */
function toggleMobileMenu() {
    const dropdown = document.getElementById('mobile-dropdown');
    const menuIcon = document.getElementById('menu-icon');
    if (dropdown) {
        const isActive = dropdown.classList.toggle('active');
        if (menuIcon) {
            menuIcon.className = isActive ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        }
    }
}

function closeMobileMenu() {
    const dropdown = document.getElementById('mobile-dropdown');
    const menuIcon = document.getElementById('menu-icon');
    if (dropdown && dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        if (menuIcon) {
            menuIcon.className = 'fa-solid fa-bars';
        }
    }
}
