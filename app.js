// ========================================
// VARIABLES GLOBALES
// ========================================
let currentUser = null;
let currentPage = 'accueil';

// ========================================
// INITIALISATION
// ========================================
window.addEventListener('DOMContentLoaded', () => {
    const savedSession = JSON.parse(localStorage.getItem('currentSession') || 'null');
    if (savedSession) {
        currentUser = savedSession;
        // Initialiser les points si non définis
        if (currentUser.data.points === undefined) {
            currentUser.data.points = 3;
            currentUser.data.matchesArbitred = 3;
            saveUserData('points', 3);
            saveUserData('matchesArbitred', 3);
        }
        updateAuthUI();
    }
    
    const savedPage = localStorage.getItem('currentPage') || 'accueil';
    loadPage(savedPage);
});

// ========================================
// GESTION DE L'AUTHENTIFICATION
// ========================================

function showLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
    document.getElementById('errorMessage').classList.add('hidden');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.add('hidden');
    document.getElementById('loginForm').reset();
    document.getElementById('errorMessage').classList.add('hidden');
}

async function handleAuth(event) {
    event.preventDefault();
    
    const nom = document.getElementById('nom').value.trim();
    const prenom = document.getElementById('prenom').value.trim();
    const password = document.getElementById('password').value;
    
    if (!nom || !prenom || !password) {
        showError('Veuillez remplir tous les champs');
        return;
    }

    if (password.length < 4) {
        showError('Le mot de passe doit contenir au moins 4 caractères');
        return;
    }
    
    const userKey = getUserKey(nom, prenom);
    const passwordHash = await hashPassword(password);
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
    
    if (allUsers[userKey]) {
        // Connexion
        if (allUsers[userKey].passwordHash === passwordHash) {
            currentUser = {
                nom: nom,
                prenom: prenom,
                userKey: userKey,
                data: allUsers[userKey].data || {}
            };
            
            localStorage.setItem('currentSession', JSON.stringify(currentUser));
            updateAuthUI();
            closeLoginModal();
        } else {
            showError('Mot de passe incorrect');
        }
    } else {
        // Inscription
        allUsers[userKey] = {
            nom: nom,
            prenom: prenom,
            passwordHash: passwordHash,
            createdAt: new Date().toISOString(),
            data: {
                points: 3,
                matchesArbitred: 3
            }
        };
        
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
        
        currentUser = {
            nom: nom,
            prenom: prenom,
            userKey: userKey,
            data: {
                points: 3,
                matchesArbitred: 3
            }
        };
        
        localStorage.setItem('currentSession', JSON.stringify(currentUser));
        updateAuthUI();
        closeLoginModal();
        showSuccess('Compte créé avec succès !');
    }
}

function logout() {
    if (currentUser) {
        const allUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
        if (allUsers[currentUser.userKey]) {
            allUsers[currentUser.userKey].data = currentUser.data;
            localStorage.setItem('allUsers', JSON.stringify(allUsers));
        }
    }
    
    currentUser = null;
    localStorage.removeItem('currentSession');
    updateAuthUI();
    loadPage('accueil');
}

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const pointsValue = document.getElementById('pointsValue');
    
    if (currentUser) {
        loginBtn.classList.add('hidden');
        userInfo.classList.remove('hidden');
        userName.textContent = `${currentUser.prenom} ${currentUser.nom}`;
        pointsValue.textContent = currentUser.data.points || 0;
    } else {
        loginBtn.classList.remove('hidden');
        userInfo.classList.add('hidden');
    }
}

// ========================================
// GESTION DE LA NAVIGATION
// ========================================

function navigateTo(page) {
    if (!currentUser) {
        showLoginModal();
        showError('Veuillez vous connecter pour accéder à cette page');
        return;
    }
    loadPage(page);
}

function loadPage(page) {
    currentPage = page;
    localStorage.setItem('currentPage', page);
    
    const mainContent = document.getElementById('mainContent');
    const pageContent = PAGES[page];
    
    if (pageContent) {
        mainContent.innerHTML = pageContent(currentUser);
    } else {
        mainContent.innerHTML = PAGES['accueil'](currentUser);
    }
}

// ========================================
// GESTION DES MOIS - QCM ET COURS
// ========================================

function showMonthContent(monthId, monthTitle, monthDescription) {
    const monthContent = document.getElementById('monthContent');
    
    // Définition du contenu pour chaque mois
    const monthsData = {
        septembre: {
            course: {
                title: 'Découverte des règles',
                description: 'Apprenez les règles de base du basketball : marcher, reprise de dribble, et sorties de terrain.',
                duration: '20 min',
                type: 'Vidéo'
            },
            qcm: {
                title: 'QCM - Règles de base',
                questions: 12,
                duration: 15
            }
        },
        octobre: {
            course: {
                title: 'Gestuelle numéro de joueur',
                description: 'Maîtrisez les gestes pour indiquer les numéros de joueurs lors des fautes.',
                duration: '15 min',
                type: 'Vidéo'
            },
            qcm: {
                title: 'QCM - Gestuelle arbitrage',
                questions: 10,
                duration: 15
            }
        },
        novembre: {
            course: {
                title: 'Gestuelle et violations',
                description: 'Apprenez tous les gestes pour signaler les violations.',
                duration: '25 min',
                type: 'Vidéo + Exercices'
            },
            qcm: {
                title: 'QCM - Violations',
                questions: 10,
                duration: 15
            }
        },
        decembre: {
            course: {
                title: 'Types de fautes',
                description: 'Différenciez les fautes personnelles, techniques, antisportives et disqualifiantes.',
                duration: '30 min',
                type: 'Vidéo + PDF'
            },
            qcm: {
                title: 'QCM - Types de fautes',
                questions: 10,
                duration: 15
            }
        },
        janvier: {
            course: {
                title: 'Vocabulaire et placement',
                description: 'Le vocabulaire technique et les positions sur le terrain.',
                duration: '20 min',
                type: 'PDF + Schémas'
            },
            qcm: {
                title: 'QCM - Placement terrain',
                questions: 10,
                duration: 15
            }
        },
        fevrier: {
            course: {
                title: 'Neutralité et respect',
                description: 'L\'éthique de l\'arbitre : neutralité, respect et gestion des émotions.',
                duration: '15 min',
                type: 'Article + Vidéo'
            },
            qcm: {
                title: 'QCM - Éthique arbitrage',
                questions: 10,
                duration: 15
            }
        },
        mars: {
            course: {
                title: 'Situations spéciales',
                description: 'Gérez les situations complexes : ballons contestés, interférences, etc.',
                duration: '25 min',
                type: 'Vidéo + Cas pratiques'
            },
            qcm: {
                title: 'QCM - Situations complexes',
                questions: 10,
                duration: 15
            }
        },
        avril: {
            course: {
                title: 'Communication et posture',
                description: 'La communication avec joueurs, coaches et co-arbitres. Posture professionnelle.',
                duration: '20 min',
                type: 'Vidéo'
            },
            qcm: {
                title: 'QCM - Communication',
                questions: 10,
                duration: 15
            }
        },
        mai: {
            course: {
                title: 'Mise en situation',
                description: 'Exercices pratiques et simulations de matchs réels.',
                duration: '40 min',
                type: 'Vidéos + Exercices'
            },
            qcm: {
                title: 'QCM - Situations pratiques',
                questions: 15,
                duration: 20
            }
        },
        juin: {
            course: {
                title: 'Test final',
                description: 'Révision complète de toutes les notions abordées durant l\'année.',
                duration: '30 min',
                type: 'Récapitulatif'
            },
            qcm: {
                title: 'QCM - Examen final',
                questions: 20,
                duration: 30
            }
        }
    };
    
    const data = monthsData[monthId];
    
    if (!data) return;
    
    // Afficher le contenu du mois sélectionné
    monthContent.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: #041f57; font-size: 18px; font-weight: 700; margin-bottom: 5px;">${monthTitle}</h3>
            <p style="color: #6c757d; font-size: 13px;">${monthDescription}</p>
        </div>
        
        <!-- Cours -->
        <div style="background: linear-gradient(135deg, #fed900 0%, #ffc107 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 3px 10px rgba(254, 217, 0, 0.3);">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span style="font-size: 28px;">📖</span>
                <h4 style="color: #041f57; font-size: 16px; font-weight: 700; margin: 0;">Cours</h4>
            </div>
            <h5 style="color: #041f57; font-size: 15px; font-weight: 700; margin-bottom: 8px;">${data.course.title}</h5>
            <p style="color: #041f57; font-size: 13px; margin-bottom: 12px; opacity: 0.9;">${data.course.description}</p>
            <div style="display: flex; gap: 15px; margin-bottom: 15px;">
                <span style="color: #041f57; font-size: 12px; font-weight: 600;">⏱️ ${data.course.duration}</span>
                <span style="color: #041f57; font-size: 12px; font-weight: 600;">📄 ${data.course.type}</span>
            </div>
            <button onclick="startCourse('${monthId}')" style="background: #041f57; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.3s;">
                ▶️ Commencer le cours
            </button>
        </div>
        
        <!-- QCM -->
        <div style="background: white; border: 2px solid #e9ecef; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span style="font-size: 28px;">📝</span>
                <h4 style="color: #041f57; font-size: 16px; font-weight: 700; margin: 0;">QCM</h4>
            </div>
            <h5 style="color: #041f57; font-size: 15px; font-weight: 700; margin-bottom: 8px;">${data.qcm.title}</h5>
            <div style="display: flex; gap: 15px; margin-bottom: 15px;">
                <span style="color: #6c757d; font-size: 12px; font-weight: 600;">❓ ${data.qcm.questions} questions</span>
                <span style="color: #6c757d; font-size: 12px; font-weight: 600;">⏱️ ${data.qcm.duration} min</span>
            </div>
            <button onclick="startQCM('${monthId}')" style="background: #041f57; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.3s;">
                🚀 Commencer le QCM
            </button>
        </div>
    `;
}

// ========================================
// GESTION DE LA BOUTIQUE
// ========================================

function buyItem(itemName, cost) {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    
    if (currentUser.data.points < cost) {
        alert(`Vous n'avez pas assez de points ! Il vous faut ${cost} points.`);
        return;
    }
    
    currentUser.data.points -= cost;
    
    if (!currentUser.data.purchases) {
        currentUser.data.purchases = [];
    }
    
    const itemNames = {
        'ballon': '🏀 Ballon de basket',
        'maillot': '👕 Maillot d\'arbitre',
        'sifflet': '📢 Sifflet professionnel',
        'short': '🎽 Short d\'arbitre'
    };
    
    currentUser.data.purchases.push({
        name: itemNames[itemName],
        cost: cost,
        date: new Date().toLocaleDateString('fr-FR')
    });
    
    saveUserData('points', currentUser.data.points);
    saveUserData('purchases', currentUser.data.purchases);
    
    updateAuthUI();
    loadPage('boutique');
    
    alert(`✅ Article acheté ! Il vous reste ${currentUser.data.points} points.`);
}

// ========================================
// GESTION DES DONNÉES UTILISATEUR
// ========================================

function saveUserData(key, value) {
    if (!currentUser) return;
    
    currentUser.data[key] = value;
    
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
    if (allUsers[currentUser.userKey]) {
        allUsers[currentUser.userKey].data = currentUser.data;
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }
    
    localStorage.setItem('currentSession', JSON.stringify(currentUser));
}

function getUserData(key) {
    if (!currentUser) return null;
    return currentUser.data[key];
}

// ========================================
// UTILITAIRES
// ========================================

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getUserKey(nom, prenom) {
    return `user_${nom.toLowerCase()}_${prenom.toLowerCase()}`;
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    errorDiv.style.background = '#fff3cd';
    errorDiv.style.color = '#856404';
    errorDiv.style.borderLeft = '4px solid #ffc107';
}

function showSuccess(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    errorDiv.style.background = '#d4edda';
    errorDiv.style.color = '#155724';
    errorDiv.style.borderLeft = '4px solid #28a745';
    
    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 3000);
}

// Fermer le modal en cliquant sur l'overlay
document.getElementById('loginModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'loginModal') {
        closeLoginModal();
    }
});