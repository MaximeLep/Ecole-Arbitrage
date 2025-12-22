// ========================================
// PAGES CONTENT - Contenu HTML de chaque page
// ========================================

const PAGES = {
    // ========== PAGE D'ACCUEIL ==========
    accueil: (currentUser) => `
        <div class="left-section">
            <h2 class="section-title">Explorez nos services</h2>
            <p class="section-subtitle">Choisissez une option pour commencer votre expérience</p>
            
            <button class="nav-button" onclick="navigateTo('profil')">
                <span class="button-text">
                    Mon Profil
                    <div class="button-description">Gérez vos informations personnelles</div>
                </span>
            </button>
            <button class="nav-button" onclick="navigateTo('qcm-cours')">
                <span class="button-text">
                    QCM et Cours
                    <div class="button-description">Accédez à vos formations et tests</div>
                </span>
            </button>
            <button class="nav-button" onclick="navigateTo('boutique')">
                <span class="button-text">
                    Boutique
                    <div class="button-description">Découvrez nos produits et services</div>
                </span>
            </button>
        </div>
         <div class="right-section">
            <div class="image-container">
                <img src="assets/img/log.png" alt="Basket Club Bergues - Arbitrage" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
        </div>
    `,

    // ========== PAGE PROFIL ==========
    profil: (currentUser) => `
        <div class="left-section">
            <h2 class="section-title">Mon Profil</h2>
            <p class="section-subtitle">Informations personnelles</p>
            
            <div style="background: white; padding: 25px; border-radius: 16px; box-shadow: 0 4px 20px rgba(4, 31, 87, 0.08);">
                <h3 style="color: #041f57; margin-bottom: 15px; font-size: 20px; font-weight: 700;">👤 Mes informations</h3>
                <p style="margin-bottom: 8px; font-size: 15px;"><strong>Nom :</strong> ${currentUser ? currentUser.nom : ''}</p>
                <p style="margin-bottom: 8px; font-size: 15px;"><strong>Prénom :</strong> ${currentUser ? currentUser.prenom : ''}</p>
                <p style="margin-bottom: 8px; font-size: 15px;"><strong>Club :</strong> B.C.B - Basket Club Bergues</p>
                <p style="margin-bottom: 15px; font-size: 15px; display: flex; align-items: center; gap: 8px;">
                    <strong>Points :</strong> 
                    <span style="background: linear-gradient(135deg, #fed900 0%, #ffc107 100%); color: #041f57; padding: 4px 12px; border-radius: 15px; font-weight: 700; display: inline-flex; align-items: center; gap: 5px;">
                        <span>⭐</span>
                        <span>${currentUser ? (currentUser.data.points || 0) : 0}</span>
                    </span>
                </p>
                <p style="margin-bottom: 8px; font-size: 14px; color: #6c757d;">
                    <strong>Matchs arbitrés :</strong> ${currentUser ? (currentUser.data.matchesArbitred || 0) : 0}
                </p>
                <p style="margin-top: 15px; color: #6c757d; font-size: 13px;">✅ Compte actif et sécurisé</p>
            </div>
            
            <button class="nav-button" onclick="navigateTo('accueil')" style="margin-top: auto;">
                <span class="button-text">← Retour à l'accueil</span>
            </button>
        </div>
        <div class="right-section" style="flex-direction: column; gap: 20px; align-items: stretch;">
            <div style="background: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 20px rgba(4, 31, 87, 0.08); flex: 1; overflow-y: auto;">
                <h3 style="color: #041f57; margin-bottom: 15px; font-size: 18px; display: flex; align-items: center; gap: 10px; font-weight: 700;">
                    🏀 Matchs du Week-End
                </h3>
                
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${generateMatchCard('Sam 23 Déc', '15:00', 'B.C.B vs Dunkerque BC', 'Gymnase de Bergues', '#fed900')}
                    ${generateMatchCard('Dim 24 Déc', '11:00', 'B.C.B vs Calais BC', 'Gymnase de Bergues', '#041f57')}
                    ${generateMatchCard('Dim 24 Déc', '17:00', 'B.C.B vs Lille Basket', 'Gymnase de Bergues', '#041f57')}
                </div>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 20px rgba(4, 31, 87, 0.08); flex: 1; overflow-y: auto;">
                <h3 style="color: #041f57; margin-bottom: 15px; font-size: 18px; display: flex; align-items: center; gap: 10px; font-weight: 700;">
                    🔔 Historique des rencontres arbitrées
                </h3>
                
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${generateHistoryCard('B.C.B vs Armentières', '15 Déc', '78-65', '3 fautes', '+1 ⭐')}
                    ${generateHistoryCard('B.C.B vs Valenciennes', '08 Déc', '82-80', '5 fautes', '+1 ⭐')}
                    ${generateHistoryCard('B.C.B vs Roubaix BC', '01 Déc', '71-69', '4 fautes', '+1 ⭐')}
                    ${generateHistoryCard('B.C.B vs Tourcoing', '24 Nov', '88-91', '2 fautes', 'Ancien', true)}
                </div>
            </div>
        </div>
    `,

    // ========== PAGE QCM ET COURS (MODIFIÉ) ==========
    'qcm-cours': (currentUser) => `
        <div class="left-section">
            <h2 class="section-title">QCM et Cours</h2>
            <p class="section-subtitle">Formation mensuelle d'arbitrage</p>
            
            <div style="background: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 20px rgba(4, 31, 87, 0.08); flex: 1; overflow-y: auto;">
                <h3 style="color: #041f57; margin-bottom: 15px; font-size: 16px; font-weight: 700;">📚 Sélectionnez un mois</h3>
                
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${generateMonthCard('septembre', '📖 SEPTEMBRE', 'Découverte des règles', '#fed900')}
                    ${generateMonthCard('octobre', '🤚 OCTOBRE', 'Gestuelle numéro de joueur', '#041f57')}
                    ${generateMonthCard('novembre', '✋ NOVEMBRE', 'Gestuelle, violations', '#fed900')}
                    ${generateMonthCard('decembre', '⚠️ DÉCEMBRE', 'Types de fautes', '#041f57')}
                    ${generateMonthCard('janvier', '📍 JANVIER', 'Vocabulaire et placement', '#fed900')}
                    ${generateMonthCard('fevrier', '🤝 FÉVRIER', 'Neutralité, respect', '#041f57')}
                    ${generateMonthCard('mars', '⭐ MARS', 'Situations spéciales', '#fed900')}
                    ${generateMonthCard('avril', '💬 AVRIL', 'Communication et posture', '#041f57')}
                    ${generateMonthCard('mai', '🎬 MAI', 'Mise en situation', '#fed900')}
                    ${generateMonthCard('juin', '🏆 JUIN', 'Test final', '#041f57')}
                </div>
            </div>
            
            <button class="nav-button" onclick="navigateTo('accueil')" style="margin-top: 15px;">
                <span class="button-text">← Retour à l'accueil</span>
            </button>
        </div>
        <div class="right-section">
            <div id="monthContent" style="background: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 20px rgba(4, 31, 87, 0.08); width: 100%; overflow-y: auto;">
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #6c757d; text-align: center; padding: 40px;">
                    <div style="font-size: 64px; margin-bottom: 20px;">📚</div>
                    <h3 style="color: #041f57; margin-bottom: 10px; font-size: 20px;">Sélectionnez un mois</h3>
                    <p style="font-size: 14px;">Cliquez sur un mois pour accéder au cours et au QCM correspondant</p>
                </div>
            </div>
        </div>
    `,

    // ========== PAGE BOUTIQUE ==========
    boutique: (currentUser) => `
        <div class="left-section">
            <h2 class="section-title">Boutique</h2>
            <p class="section-subtitle">Dépensez vos points</p>
            
            <div style="background: linear-gradient(135deg, #fed900 0%, #ffc107 100%); padding: 15px 20px; border-radius: 12px; box-shadow: 0 4px 20px rgba(254, 217, 0, 0.3); margin-bottom: 15px;">
                <h3 style="color: #041f57; margin-bottom: 5px; font-size: 14px; font-weight: 700;">💰 Points disponibles</h3>
                <p style="color: #041f57; font-size: 28px; font-weight: 800; display: flex; align-items: center; gap: 8px;">
                    <span>⭐</span>
                    <span>${currentUser ? (currentUser.data.points || 0) : 0}</span>
                </p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 20px rgba(4, 31, 87, 0.08); flex: 1; overflow-y: auto;">
                <h3 style="color: #041f57; margin-bottom: 12px; font-size: 16px; font-weight: 700;">🛍️ Articles disponibles</h3>
                
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${generateProductCard('🏀', 'Ballon de basket', 'Ballon officiel Molten GG7X', 5, 'ballon', '#ff6b35', '#ff8c42', currentUser)}
                    ${generateProductCard('👕', 'Maillot d\'arbitre', 'Maillot officiel rayé', 8, 'maillot', '#4169e1', '#6495ed', currentUser)}
                    ${generateProductCard('📢', 'Sifflet professionnel', 'Sifflet Fox 40 Classic', 3, 'sifflet', '#ffd700', '#ffed4e', currentUser)}
                    ${generateProductCard('🎽', 'Short d\'arbitre', 'Short noir officiel', 6, 'short', '#2c3e50', '#34495e', currentUser)}
                </div>
            </div>
            
            <button class="nav-button" onclick="navigateTo('accueil')" style="margin-top: 15px;">
                <span class="button-text">← Retour à l'accueil</span>
            </button>
        </div>
        <div class="right-section">
            <div style="background: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 20px rgba(4, 31, 87, 0.08); width: 100%; overflow-y: auto;">
                <h3 style="color: #041f57; margin-bottom: 12px; font-size: 16px; font-weight: 700;">🎁 Mes achats</h3>
                <div id="purchaseHistory" style="display: flex; flex-direction: column; gap: 8px;">
                    ${currentUser && currentUser.data.purchases && currentUser.data.purchases.length > 0 ? 
                        currentUser.data.purchases.map(p => `
                            <div style="padding: 10px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                                <div style="font-weight: 600; color: #041f57; font-size: 13px; margin-bottom: 3px;">${p.name}</div>
                                <div style="font-size: 11px; color: #6c757d;">${p.date} • ${p.cost} points</div>
                            </div>
                        `).join('') 
                        : '<p style="color: #6c757d; text-align: center; padding: 20px; font-size: 13px;">Aucun achat pour le moment</p>'
                    }
                </div>
            </div>
        </div>
    `
};

// ========================================
// HELPER FUNCTIONS - Fonctions pour générer les cartes
// ========================================

// Génère une carte de match
function generateMatchCard(date, time, match, location, color) {
    return `
        <div style="border-left: 4px solid ${color}; padding: 12px; background: #f8f9fa; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-weight: 700; color: #041f57; font-size: 14px;">${date}</span>
                <span style="color: #fed900; font-weight: 600; font-size: 14px;">${time}</span>
            </div>
            <div style="color: #041f57; font-size: 14px; margin-bottom: 4px; font-weight: 600;">
                ${match}
            </div>
            <div style="color: #6c757d; font-size: 12px;">
                📍 ${location}
            </div>
        </div>
    `;
}

// Génère une carte d'historique de match
function generateHistoryCard(match, date, score, fouls, points, isOld = false) {
    return `
        <div style="padding: 10px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef; ${isOld ? 'opacity: 0.6;' : ''}">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="font-weight: 600; color: #041f57; font-size: 13px;">${match}</span>
                <span style="color: #6c757d; font-size: 12px;">${date}</span>
            </div>
            <div style="color: #6c757d; font-size: 12px; display: flex; justify-content: space-between; align-items: center;">
                <span>📍 Bergues • Score: ${score} • ${fouls}</span>
                <span style="color: ${isOld ? '#6c757d' : '#fed900'}; font-weight: 700;">${points}</span>
            </div>
        </div>
    `;
}

// Génère une carte de mois (NOUVELLE FONCTION)
function generateMonthCard(monthId, title, description, borderColor) {
    return `
        <div style="padding: 12px; background: #f8f9fa; border-radius: 10px; border-left: 4px solid ${borderColor}; cursor: pointer; transition: all 0.3s;" onclick="showMonthContent('${monthId}', '${title}', '${description}')">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: 700; color: #041f57; font-size: 13px; margin-bottom: 3px;">${title}</div>
                    <div style="font-size: 12px; color: #6c757d;">${description}</div>
                </div>
                <span style="color: ${borderColor}; font-size: 18px;">→</span>
            </div>
        </div>
    `;
}

// Génère une carte de produit
function generateProductCard(emoji, name, description, cost, id, color1, color2, currentUser) {
    const canBuy = currentUser && currentUser.data.points >= cost;
    const btnBg = canBuy ? '#041f57' : '#ccc';
    const cursor = canBuy ? 'pointer' : 'not-allowed';
    
    return `
        <div style="padding: 12px; background: white; border-radius: 10px; border: 2px solid #e9ecef; box-shadow: 0 2px 6px rgba(0,0,0,0.05); display: flex; gap: 12px; align-items: center;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, ${color1} 0%, ${color2} 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 32px; flex-shrink: 0;">
                ${emoji}
            </div>
            <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 700; color: #041f57; margin-bottom: 2px; font-size: 13px;">${name}</div>
                <div style="font-size: 11px; color: #6c757d; margin-bottom: 6px;">${description}</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: #fed900; font-weight: 700; font-size: 14px;">⭐ ${cost}</span>
                    <button onclick="buyItem('${id}', ${cost})" style="background: ${btnBg}; color: white; border: none; padding: 5px 12px; border-radius: 6px; cursor: ${cursor}; font-weight: 600; font-size: 11px;">Acheter</button>
                </div>
            </div>
        </div>
    `;
}