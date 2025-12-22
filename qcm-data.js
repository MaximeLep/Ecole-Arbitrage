// ========================================
// QCM DATA - Données des QCM pour chaque mois
// ========================================

const QCM_DATA = {
    septembre: {
        title: 'QCM - Règles de base',
        passingScore: 10, // Score minimum requis sur 12
        questions: [
            {
                question: "Combien de pas a-t-on le droit au basket ?",
                options: ["2 pas", "3 pas", "4 pas"],
                correct: 0
            },
            {
                question: "Lorsqu'on arrête le dribble et repart en dribblant on est sanctionné pour :",
                options: ["Marché", "Reprise de dribble", "Portée de balle"],
                correct: 1
            },
            {
                question: "Si l'entièreté de la main passe sous la balle quelle est la violation ?",
                options: ["Reprise", "Marché", "Portée de balle"],
                correct: 2
            },
            {
                question: "Combien de temps a-t-on pour traverser la ligne médiane lors d'une montée de balle ?",
                options: ["24 secondes", "8 secondes", "10 secondes"],
                correct: 1
            },
            {
                question: "Combien de temps dure une possession au basket ?",
                options: ["24 secondes", "33 secondes", "28 secondes", "Pas de limite de temps"],
                correct: 0
            },
            {
                question: "Après un rebond offensif, la possession est remise à :",
                options: ["24 secondes", "12 secondes", "14 secondes"],
                correct: 2
            },
            {
                question: "S'il y a faute sous 14 secondes de possession, elle est remise à :",
                options: ["14 secondes", "24 secondes", "Au temps qu'il restait durant la possession"],
                correct: 0
            },
            {
                question: "Quand un joueur arrête son dribble pendant une pression défensive et garde la balle 5 secondes. Qu'en découle cette action ?",
                options: ["Marché", "Reprise de dribble", "Violation balle à l'adversaire", "Il ne se passe rien"],
                correct: 2
            },
            {
                question: "Une faute antisportive est :",
                options: ["Une faute violente", "Une faute sans intention de jouer le ballon", "Une faute technique"],
                correct: 1
            },
            {
                question: "Quand l'arbitre utilise-t-il le sifflet ?",
                options: ["À chaque contact", "Pour arrêter le jeu lors d'une infraction", "Uniquement en fin de période"],
                correct: 1
            },
            {
                question: "Pourquoi le bon positionnement est-il important ?",
                options: ["Voir l'action clairement", "Être crédible", "Les deux"],
                correct: 2
            },
            {
                question: "Que doit faire un arbitre s'il n'est pas sûr de sa décision ?",
                options: ["Siffler quand même", "Laisser jouer", "Consulter son coéquipier arbitre"],
                correct: 2
            }
        ]
    }
};

// Ordre chronologique des mois
const MONTH_ORDER = [
    'septembre', 'octobre', 'novembre', 'decembre',
    'janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin'
];

// ========================================
// GESTION DU COOLDOWN 24H
// ========================================

function canEarnPointsForVideo(monthId) {
    if (!currentUser) return false;
    
    const lastWatch = currentUser.data.lastVideoWatch?.[monthId];
    if (!lastWatch) return true;
    
    const now = new Date().getTime();
    const lastWatchTime = new Date(lastWatch).getTime();
    const hoursSince = (now - lastWatchTime) / (1000 * 60 * 60);
    
    return hoursSince >= 24;
}

function canEarnPointsForQCM(monthId) {
    if (!currentUser) return false;
    
    const lastQCM = currentUser.data.lastQCMPoints?.[monthId];
    if (!lastQCM) return true;
    
    const now = new Date().getTime();
    const lastQCMTime = new Date(lastQCM).getTime();
    const hoursSince = (now - lastQCMTime) / (1000 * 60 * 60);
    
    return hoursSince >= 24;
}

function getTimeUntilNextPoints(monthId, type) {
    if (!currentUser) return null;
    
    const lastTime = type === 'video' 
        ? currentUser.data.lastVideoWatch?.[monthId]
        : currentUser.data.lastQCMPoints?.[monthId];
    
    if (!lastTime) return null;
    
    const now = new Date().getTime();
    const lastTimestamp = new Date(lastTime).getTime();
    const hoursRemaining = 24 - ((now - lastTimestamp) / (1000 * 60 * 60));
    
    if (hoursRemaining <= 0) return null;
    
    const hours = Math.floor(hoursRemaining);
    const minutes = Math.floor((hoursRemaining - hours) * 60);
    
    return `${hours}h${minutes.toString().padStart(2, '0')}`;
}

// ========================================
// GESTION DES POINTS
// ========================================

function awardVideoPoints(monthId) {
    if (!currentUser || !canEarnPointsForVideo(monthId)) return 0;
    
    // Gagner 2 points pour avoir regardé la vidéo
    currentUser.data.points = (currentUser.data.points || 0) + 2;
    
    // Enregistrer le timestamp
    if (!currentUser.data.lastVideoWatch) {
        currentUser.data.lastVideoWatch = {};
    }
    currentUser.data.lastVideoWatch[monthId] = new Date().toISOString();
    
    saveUserData('points', currentUser.data.points);
    saveUserData('lastVideoWatch', currentUser.data.lastVideoWatch);
    updateAuthUI();
    
    return 2;
}

function calculateQCMPoints(score, totalQuestions) {
    const percentage = (score / totalQuestions) * 100;
    
    if (percentage === 100) {
        return 2; // Sans erreur
    } else if (percentage >= 50) {
        return 1; // Avec erreurs mais au moins la moitié
    } else {
        return 0; // Moins de la moitié
    }
}

function awardQCMPoints(monthId, points) {
    if (!currentUser || !canEarnPointsForQCM(monthId) || points === 0) return 0;
    
    currentUser.data.points = (currentUser.data.points || 0) + points;
    
    // Enregistrer le timestamp
    if (!currentUser.data.lastQCMPoints) {
        currentUser.data.lastQCMPoints = {};
    }
    currentUser.data.lastQCMPoints[monthId] = new Date().toISOString();
    
    saveUserData('points', currentUser.data.points);
    saveUserData('lastQCMPoints', currentUser.data.lastQCMPoints);
    updateAuthUI();
    
    return points;
}

// Vérifier si un mois est déverrouillé
function isMonthUnlocked(monthId) {
    if (monthId === 'septembre') return true;
    if (!currentUser) return false;
    
    const monthIndex = MONTH_ORDER.indexOf(monthId);
    if (monthIndex === -1) return false;
    
    for (let i = 0; i < monthIndex; i++) {
        const previousMonth = MONTH_ORDER[i];
        const previousResult = currentUser.data.qcmResults?.[previousMonth];
        
        if (!previousResult || !previousResult.validated) {
            return false;
        }
    }
    
    return true;
}

function getPreviousUnvalidatedMonth(monthId) {
    const monthIndex = MONTH_ORDER.indexOf(monthId);
    if (monthIndex <= 0) return null;
    
    for (let i = monthIndex - 1; i >= 0; i--) {
        const previousMonth = MONTH_ORDER[i];
        const previousResult = currentUser.data.qcmResults?.[previousMonth];
        
        if (!previousResult || !previousResult.validated) {
            return previousMonth;
        }
    }
    
    return null;
}

function getMonthNameFr(monthId) {
    const monthNames = {
        'septembre': 'Septembre', 'octobre': 'Octobre', 'novembre': 'Novembre',
        'decembre': 'Décembre', 'janvier': 'Janvier', 'fevrier': 'Février',
        'mars': 'Mars', 'avril': 'Avril', 'mai': 'Mai', 'juin': 'Juin'
    };
    return monthNames[monthId] || monthId;
}

// ========================================
// FONCTION POUR AFFICHER LE COURS (VIDÉO)
// ========================================

function startCourse(monthId) {
    const monthContent = document.getElementById('monthContent');
    
    if (!isMonthUnlocked(monthId)) {
        const blockedMonth = getPreviousUnvalidatedMonth(monthId);
        monthContent.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <div style="font-size: 64px; margin-bottom: 20px;">🔒</div>
                <h3 style="color: #041f57; font-size: 24px; font-weight: 700; margin-bottom: 15px;">Contenu verrouillé</h3>
                <p style="color: #6c757d; font-size: 16px; margin-bottom: 30px;">
                    Vous devez valider le QCM de <strong>${getMonthNameFr(blockedMonth)}</strong> pour accéder à ce cours.
                </p>
                <button onclick="loadPage('qcm-cours')" style="background: linear-gradient(135deg, #fed900 0%, #ffc107 100%); border: none; color: #041f57; padding: 14px 30px; border-radius: 10px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(254, 217, 0, 0.3);">
                    ← Retour aux cours
                </button>
            </div>
        `;
        return;
    }
    
    if (monthId === 'septembre') {
        const canEarnPoints = canEarnPointsForVideo(monthId);
        const timeRemaining = getTimeUntilNextPoints(monthId, 'video');
        
        monthContent.innerHTML = `
            <div style="padding: 20px;">
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #041f57; font-size: 22px; font-weight: 700; margin-bottom: 10px;">📖 Cours Septembre</h3>
                    <h4 style="color: #041f57; font-size: 18px; font-weight: 600; margin-bottom: 5px;">Découverte des règles</h4>
                    <p style="color: #6c757d; font-size: 14px;">Apprenez les règles de base du basketball</p>
                    
                    ${canEarnPoints ? `
                        <div style="margin-top: 10px; padding: 10px; background: #d4edda; border-radius: 8px; border-left: 4px solid #28a745;">
                            <p style="color: #155724; font-size: 13px; margin: 0; font-weight: 600;">
                                🎁 +2 points disponibles après avoir regardé la vidéo !
                            </p>
                        </div>
                    ` : timeRemaining ? `
                        <div style="margin-top: 10px; padding: 10px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
                            <p style="color: #856404; font-size: 13px; margin: 0; font-weight: 600;">
                                ⏱️ Prochain gain de points dans ${timeRemaining}
                            </p>
                        </div>
                    ` : ''}
                </div>
                
                <div style="background: white; padding: 25px; border-radius: 16px; box-shadow: 0 4px 20px rgba(4, 31, 87, 0.08); margin-bottom: 25px;">
                    <div id="videoContainer" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; background: #000;">
                        <iframe 
                            id="youtubePlayer"
                            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                            src="https://www.youtube.com/embed/eEjJi1lOgAw?enablejsapi=1" 
                            title="Cours de basketball" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    </div>
                    
                    <div style="margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 12px;">
                        <h5 style="color: #041f57; font-size: 16px; font-weight: 700; margin-bottom: 10px;">📋 Contenu du cours</h5>
                        <ul style="color: #6c757d; font-size: 14px; line-height: 1.8; padding-left: 20px;">
                            <li>Les règles du marcher</li>
                            <li>La reprise de dribble</li>
                            <li>Les sorties de terrain</li>
                            <li>Les violations courantes</li>
                        </ul>
                    </div>
                    
                    ${canEarnPoints ? `
                        <button onclick="markVideoAsWatched('${monthId}')" style="width: 100%; margin-top: 15px; background: linear-gradient(135deg, #28a745 0%, #34ce57 100%); border: none; color: white; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.3s;">
                            ✅ J'ai regardé la vidéo (+2 points)
                        </button>
                    ` : ''}
                </div>
                
                <div style="display: flex; gap: 15px;">
                    <button onclick="startQCM('septembre')" style="flex: 1; background: linear-gradient(135deg, #fed900 0%, #ffc107 100%); border: none; color: #041f57; padding: 14px 24px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(254, 217, 0, 0.3);">
                        📝 Passer au QCM
                    </button>
                    <button onclick="showMonthContent('septembre', '📖 SEPTEMBRE', 'Découverte des règles')" style="flex: 1; background: white; border: 2px solid #e9ecef; color: #041f57; padding: 14px 24px; border-radius: 10px; font-weight: 600; font-size: 15px; cursor: pointer; transition: all 0.3s;">
                        ← Retour
                    </button>
                </div>
            </div>
        `;
    } else {
        monthContent.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <div style="font-size: 64px; margin-bottom: 20px;">🚧</div>
                <h3 style="color: #041f57; font-size: 24px; font-weight: 700; margin-bottom: 15px;">Cours en préparation</h3>
                <p style="color: #6c757d; font-size: 16px; margin-bottom: 30px;">Le contenu de ce cours sera bientôt disponible.</p>
                <button onclick="showMonthContent('${monthId}', '${getMonthNameFr(monthId)}', '')" style="background: linear-gradient(135deg, #fed900 0%, #ffc107 100%); border: none; color: #041f57; padding: 14px 30px; border-radius: 10px; font-weight: 700; cursor: pointer;">
                    ← Retour
                </button>
            </div>
        `;
    }
}

function markVideoAsWatched(monthId) {
    const pointsEarned = awardVideoPoints(monthId);
    
    if (pointsEarned > 0) {
        alert(`🎉 Bravo ! Vous avez gagné ${pointsEarned} points !`);
        startCourse(monthId); // Recharger pour mettre à jour l'affichage
    }
}

// ========================================
// FONCTION POUR DÉMARRER UN QCM
// ========================================

function startQCM(monthId) {
    if (!isMonthUnlocked(monthId)) {
        const monthContent = document.getElementById('monthContent');
        const blockedMonth = getPreviousUnvalidatedMonth(monthId);
        monthContent.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <div style="font-size: 64px; margin-bottom: 20px;">🔒</div>
                <h3 style="color: #041f57; font-size: 24px; font-weight: 700; margin-bottom: 15px;">QCM verrouillé</h3>
                <p style="color: #6c757d; font-size: 16px; margin-bottom: 30px;">
                    Vous devez valider le QCM de <strong>${getMonthNameFr(blockedMonth)}</strong> pour accéder à ce QCM.
                </p>
                <button onclick="loadPage('qcm-cours')" style="background: linear-gradient(135deg, #fed900 0%, #ffc107 100%); border: none; color: #041f57; padding: 14px 30px; border-radius: 10px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(254, 217, 0, 0.3);">
                    ← Retour aux cours
                </button>
            </div>
        `;
        return;
    }
    
    const qcmData = QCM_DATA[monthId];
    
    if (!qcmData) {
        const monthContent = document.getElementById('monthContent');
        monthContent.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <div style="font-size: 64px; margin-bottom: 20px;">🚧</div>
                <h3 style="color: #041f57; font-size: 24px; font-weight: 700; margin-bottom: 15px;">QCM en préparation</h3>
                <p style="color: #6c757d; font-size: 16px; margin-bottom: 30px;">Le QCM de ce mois sera bientôt disponible.</p>
                <button onclick="showMonthContent('${monthId}', '${getMonthNameFr(monthId)}', '')" style="background: linear-gradient(135deg, #fed900 0%, #ffc107 100%); border: none; color: #041f57; padding: 14px 30px; border-radius: 10px; font-weight: 700; cursor: pointer;">
                    ← Retour
                </button>
            </div>
        `;
        return;
    }
    
    displayQuestion(qcmData, 0, 0, [], monthId);
}

function displayQuestion(qcmData, currentQuestion, score, userAnswers, monthId) {
    const monthContent = document.getElementById('monthContent');
    const question = qcmData.questions[currentQuestion];
    const totalQuestions = qcmData.questions.length;
    const progress = ((currentQuestion) / totalQuestions) * 100;
    const canEarnPoints = canEarnPointsForQCM(monthId);
    const timeRemaining = getTimeUntilNextPoints(monthId, 'qcm');
    
    monthContent.innerHTML = `
        <div style="padding: 20px;">
            <div style="margin-bottom: 25px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="color: #041f57; font-size: 20px; font-weight: 700;">${qcmData.title}</h3>
                    <span style="background: linear-gradient(135deg, #fed900 0%, #ffc107 100%); color: #041f57; padding: 6px 14px; border-radius: 20px; font-size: 14px; font-weight: 700;">
                        Question ${currentQuestion + 1}/${totalQuestions}
                    </span>
                </div>
                
                ${canEarnPoints && currentQuestion === 0 ? `
                    <div style="padding: 10px; background: #d4edda; border-radius: 8px; border-left: 4px solid #28a745; margin-bottom: 15px;">
                        <p style="color: #155724; font-size: 13px; margin: 0; font-weight: 600;">
                            🎁 Jusqu'à +2 points disponibles selon vos résultats !
                        </p>
                    </div>
                ` : !canEarnPoints && timeRemaining && currentQuestion === 0 ? `
                    <div style="padding: 10px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 15px;">
                        <p style="color: #856404; font-size: 13px; margin: 0; font-weight: 600;">
                            ⏱️ Prochain gain de points dans ${timeRemaining}
                        </p>
                    </div>
                ` : ''}
                
                <div style="width: 100%; height: 8px; background: #e9ecef; border-radius: 10px; overflow: hidden;">
                    <div style="width: ${progress}%; height: 100%; background: linear-gradient(135deg, #fed900 0%, #ffc107 100%); transition: width 0.3s ease;"></div>
                </div>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 20px rgba(4, 31, 87, 0.08); margin-bottom: 25px;">
                <h4 style="color: #041f57; font-size: 18px; font-weight: 600; line-height: 1.6; margin-bottom: 25px;">
                    ${question.question}
                </h4>
                
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${question.options.map((option, index) => `
                        <button 
                            onclick="selectAnswer(${index}, ${currentQuestion}, ${score}, ${JSON.stringify(userAnswers).replace(/"/g, '&quot;')}, '${monthId}')"
                            style="background: #f8f9fa; border: 2px solid #e9ecef; padding: 16px 20px; border-radius: 12px; font-size: 15px; font-weight: 500; color: #041f57; cursor: pointer; transition: all 0.3s; text-align: left;"
                            onmouseover="this.style.background='#fed900'; this.style.borderColor='#fed900'; this.style.transform='translateX(5px)';"
                            onmouseout="this.style.background='#f8f9fa'; this.style.borderColor='#e9ecef'; this.style.transform='translateX(0)';"
                        >
                            ${String.fromCharCode(65 + index)}. ${option}
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <button onclick="loadPage('qcm-cours')" style="background: white; border: 2px solid #e9ecef; color: #041f57; padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.3s;">
                ← Retour au cours
            </button>
        </div>
    `;
}

function selectAnswer(selectedIndex, currentQuestion, score, userAnswers, monthId) {
    const qcmData = QCM_DATA[monthId];
    const question = qcmData.questions[currentQuestion];
    
    userAnswers.push({
        question: currentQuestion,
        selected: selectedIndex,
        correct: question.correct
    });
    
    if (selectedIndex === question.correct) {
        score++;
    }
    
    if (currentQuestion + 1 < qcmData.questions.length) {
        displayQuestion(qcmData, currentQuestion + 1, score, userAnswers, monthId);
    } else {
        displayResults(qcmData, score, userAnswers, monthId);
    }
}

function displayResults(qcmData, score, userAnswers, monthId) {
    const monthContent = document.getElementById('monthContent');
    const totalQuestions = qcmData.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const isPassed = score >= qcmData.passingScore;
    
    // Calculer les points QCM
    const qcmPoints = calculateQCMPoints(score, totalQuestions);
    const earnedQCMPoints = awardQCMPoints(monthId, qcmPoints);
    
    // Sauvegarder le résultat
    if (currentUser) {
        if (!currentUser.data.qcmResults) {
            currentUser.data.qcmResults = {};
        }
        
        currentUser.data.qcmResults[monthId] = {
            score: score,
            total: totalQuestions,
            percentage: percentage,
            validated: isPassed,
            pointsEarned: earnedQCMPoints,
            date: new Date().toISOString()
        };
        
        saveUserData('qcmResults', currentUser.data.qcmResults);
    }
    
    let resultMessage = '';
    let resultEmoji = '';
    
    if (isPassed) {
        resultMessage = 'Félicitations ! Vous avez validé ce QCM !';
        resultEmoji = '🎉';
    } else {
        resultMessage = `Il vous faut au moins ${qcmData.passingScore}/${totalQuestions} pour valider`;
        resultEmoji = '💪';
    }
    
    monthContent.innerHTML = `
        <div style="padding: 20px;">
            <div style="background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(4, 31, 87, 0.08); text-align: center; margin-bottom: 25px;">
                <div style="font-size: 64px; margin-bottom: 20px;">${resultEmoji}</div>
                <h3 style="color: #041f57; font-size: 28px; font-weight: 700; margin-bottom: 10px;">${resultMessage}</h3>
                <p style="color: #6c757d; font-size: 16px; margin-bottom: 30px;">Vous avez terminé le QCM</p>
                
                <div style="display: inline-block; background: linear-gradient(135deg, ${isPassed ? '#28a745' : '#fed900'} 0%, ${isPassed ? '#34ce57' : '#ffc107'} 100%); padding: 20px 40px; border-radius: 16px; margin-bottom: 30px;">
                    <div style="font-size: 48px; font-weight: 800; color: ${isPassed ? '#fff' : '#041f57'};">${score}/${totalQuestions}</div>
                    <div style="font-size: 18px; font-weight: 600; color: ${isPassed ? '#fff' : '#041f57'};">${percentage}%</div>
                </div>
                
                ${earnedQCMPoints > 0 ? `
                    <div style="background: #d4edda; padding: 15px; border-radius: 12px; border-left: 4px solid #28a745; margin-bottom: 20px;">
                        <p style="color: #155724; font-weight: 700; margin: 0; font-size: 16px;">
                            🎁 Vous avez gagné ${earnedQCMPoints} point${earnedQCMPoints > 1 ? 's' : ''} !
                        </p>
                    </div>
                ` : qcmPoints > 0 ? `
                    <div style="background: #fff3cd; padding: 15px; border-radius: 12px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
                        <p style="color: #856404; font-weight: 600; margin: 0;">
                            ⏱️ Points déjà gagnés aujourd'hui. Revenez dans 24h !
                        </p>
                    </div>
                ` : ''}
                
                ${isPassed ? `
                    <div style="background: #d4edda; padding: 15px; border-radius: 12px; border-left: 4px solid #28a745; margin-bottom: 20px;">
                        <p style="color: #155724; font-weight: 600; margin: 0;">
                            ✅ Vous pouvez maintenant accéder au cours suivant !// Suite du fichier qcm-data.js (copier après le code précédent)

                        </p>
                    </div>
                ` : `
                    <div style="background: #fff3cd; padding: 15px; border-radius: 12px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
                        <p style="color: #856404; font-weight: 600; margin: 0;">
                            ⚠️ Score insuffisant. Réessayez pour débloquer le cours suivant !
                        </p>
                    </div>
                `}
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
                    <div style="display: flex; justify-content: space-around; text-align: center;">
                        <div>
                            <div style="font-size: 24px; font-weight: 700; color: #28a745;">✓ ${score}</div>
                            <div style="font-size: 14px; color: #6c757d;">Correctes</div>
                        </div>
                        <div>
                            <div style="font-size: 24px; font-weight: 700; color: #dc3545;">✗ ${totalQuestions - score}</div>
                            <div style="font-size: 14px; color: #6c757d;">Incorrectes</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 20px rgba(4, 31, 87, 0.08); margin-bottom: 25px;">
                <h4 style="color: #041f57; font-size: 20px; font-weight: 700; margin-bottom: 20px;">📋 Correction détaillée</h4>
                
                ${qcmData.questions.map((q, index) => {
                    const userAnswer = userAnswers[index];
                    const isCorrect = userAnswer.selected === userAnswer.correct;
                    
                    return `
                        <div style="padding: 20px; background: ${isCorrect ? '#d4edda' : '#f8d7da'}; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid ${isCorrect ? '#28a745' : '#dc3545'};">
                            <div style="font-weight: 700; color: #041f57; margin-bottom: 10px; font-size: 15px;">
                                Question ${index + 1} ${isCorrect ? '✓' : '✗'}
                            </div>
                            <div style="color: #041f57; margin-bottom: 10px; font-size: 14px;">
                                ${q.question}
                            </div>
                            <div style="font-size: 13px; color: #6c757d;">
                                <strong>Votre réponse :</strong> ${q.options[userAnswer.selected]}
                            </div>
                            ${!isCorrect ? `
                                <div style="font-size: 13px; color: #28a745; margin-top: 5px;">
                                    <strong>Bonne réponse :</strong> ${q.options[userAnswer.correct]}
                                </div>
                            ` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div style="display: flex; gap: 15px;">
                <button onclick="startQCM('${monthId}')" style="flex: 1; background: linear-gradient(135deg, #fed900 0%, #ffc107 100%); border: none; color: #041f57; padding: 14px 24px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.3s;">
                    🔄 Recommencer le QCM
                </button>
                <button onclick="loadPage('qcm-cours')" style="flex: 1; background: white; border: 2px solid #e9ecef; color: #041f57; padding: 14px 24px; border-radius: 10px; font-weight: 600; font-size: 15px; cursor: pointer; transition: all 0.3s;">
                    ← Retour aux cours
                </button>
            </div>
        </div>
    `;
}