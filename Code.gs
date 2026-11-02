/**
 * Base en ligne pour « Dossiers de vente »  —  version 12
 * ---------------------------------------------------------------------------
 * À coller dans un projet Google Apps Script, puis à déployer en application
 * web. Les données sont enregistrées dans votre propre Google Drive : rien ne
 * sort de votre compte.
 *
 * ►►► APRÈS AVOIR COLLÉ CETTE VERSION, LANCEZ LA FONCTION « autoriser »
 *     UNE FOIS DEPUIS L'ÉDITEUR (liste des fonctions en haut, puis ▶ Exécuter).
 *     Google vous demandera alors l'accès à votre agenda, et c'est le seul
 *     moment où il peut vous le demander : une application web déployée n'a
 *     pas d'écran pour poser la question — elle échoue, simplement, avec un
 *     message « The script does not have permission to perform that action ».
 *     Déployer une nouvelle version NE SUFFIT PAS.
 *
 * Cette version 11 sait poser un RENDEZ-VOUS DE VISITE dans votre agenda
 * Google : titre, lieu, horaire, le demandeur en invité, et la fiche du
 * bien en pièce jointe. Elle demande donc une autorisation de plus —
 * l'accès à votre agenda —, que Google vous redemandera à la première
 * utilisation. Tant que vous n'organisez pas de visite depuis
 * l'application, rien ne change.
 *
 * POUR QUE LA FICHE SOIT UNE VRAIE PIÈCE JOINTE du rendez-vous, et non
 * un lien dans sa description, activez le service avancé de l'agenda :
 * dans l'éditeur du script, « Services » (+) → « Google Calendar API »
 * → Ajouter. Sans cela tout fonctionne, mais la fiche est déposée dans
 * votre Drive et le rendez-vous en donne l'adresse.
 *
 * La version 10 reconnaissait une fiche de carnet à son IDENTIFIANT quand
 * elle en porte un, et non plus à son seul nom. C'est ce qu'exige le
 * nouveau fichier des acquéreurs : deux personnes peuvent s'appeler
 * pareil et chercher deux biens différents, et aucune ne doit effacer
 * l'autre quand deux appareils se retrouvent. Tout le reste est
 * identique à la version 9 ; si vous ne tenez pas de fichier
 * d'acquéreurs, la mise à jour ne change rien pour vous.
 *
 * La version 9 NE SORT PLUS DE CHEZ VOUS. Les deux relais vers
 * l'extérieur — la réécriture des annonces par Gemini (versions 4 et 5) et
 * la recherche d'une étude dans l'annuaire des entreprises (version 8) —
 * ont été retirés : à l'usage, ils ne rendaient pas le service attendu.
 * Plus aucune clé d'un tiers à entretenir, plus aucun appel sortant : ce
 * script ne parle qu'à votre Drive.
 *
 * Elle garde la protection des CARNETS : un enregistrement qui
 * ferait disparaître une fiche que la base possédait ne passe plus, sauf
 * si le registre des retraits qui l'accompagne dit qu'elle a été
 * supprimée exprès.
 *
 * La version 7 protégeait les CARNETS et SAUVEGARDE la base. Un
 * enregistrement qui viderait un carnet garni — immeubles, négociateurs,
 * notaires, clercs, syndics — ne passe plus : le script recolle le carnet
 * d'avant. Et avant la première écriture de chaque journée, il met de côté
 * la base telle qu'elle était, dans un dossier « Dossiers de vente -
 * sauvegardes » : quinze jours en arrière, un fichier par jour.
 *
 * La version 6 avait ajouté les COMPTES : identifiant, mot de passe et
 * niveau d'accès par personne. Tant qu'aucun compte n'existe, rien ne
 * change — la clé partagée suffit. Dès le premier compte créé, le script
 * ne livre plus rien sans une séance ouverte : c'est là, et non dans la
 * page, que se trouve la serrure.
 *
 * La version 3 avait ajouté les PIÈCES JOINTES et le renommage d'une pièce. Les dossiers eux-mêmes restent
 * dans un fichier JSON ; les pièces — photos, PDF — deviennent de vrais
 * fichiers rangés dans une arborescence lisible :
 *
 *     Dossiers de vente — pièces/
 *       1300 — 3 rue Gambetta, ARLES/
 *         photos/ 01.jpg, 02.jpg…
 *         Mandat signé.pdf
 *       Immeubles/ LE CLOS SAINT-JEAN/
 *       Personnes/ ARNOUX Jean/
 *
 * Vous pouvez donc les ouvrir, les envoyer ou les imprimer depuis Drive, sans
 * l'application. Si un jour vous l'abandonnez, votre Drive reste exploitable.
 *
 * MODE D'EMPLOI — PREMIÈRE INSTALLATION
 *  1. Allez sur  script.google.com  et créez un « Nouveau projet ».
 *  2. Effacez le contenu de Code.gs et collez tout ce fichier à la place.
 *  3. Remplacez la clé ci-dessous par un mot de passe à vous (ligne CLE).
 *  4. Enregistrez (icône disquette).
 *  5. Bouton bleu « Déployer » → « Nouveau déploiement ».
 *       · Type            : Application Web
 *       · Description     : Dossiers de vente
 *       · Exécuter en tant que        : Moi
 *       · Qui a accès à l'application : Tout le monde
 *     Puis « Déployer », autorisez l'accès quand Google le demande
 *     (« Paramètres avancées » → « Accéder à … » si un avertissement s'affiche :
 *      c'est votre propre script, il n'est pas publié, ce message est normal).
 *  6. Copiez l'« URL de l'application Web ». Elle se termine par /exec.
 *  7. Dans l'application, onglet Listes → « Base partagée » → « Connecter une
 *     base en ligne » : collez cette adresse et la clé. Faites de même sur
 *     votre tablette, avec la même adresse et la même clé.
 *
 * MISE À JOUR DEPUIS UNE VERSION PRÉCÉDENTE
 *  Remplacez tout le contenu de Code.gs par ce fichier, REMETTEZ VOTRE CLÉ
 *  (ligne CLE), enregistrez, puis « Déployer » → « Gérer les déploiements »
 *  → crayon → Version « Nouvelle version » → « Déployer ». L'adresse ne change
 *  pas, et vos dossiers sont intacts. Sans cette republication, Google
 *  continue de servir l'ancien code et les pièces jointes ne partiront pas.
 *  En venant d'une version antérieure à la 11, la première visite créée
 *  déclenchera une nouvelle demande d'autorisation (votre agenda) :
 *  acceptez-la, c'est votre propre script qui la demande.
 *  En venant de la 11, le premier échange rangera sous « DOSSIERS DE
 *  VENTE » ce qui se trouverait encore ailleurs. Les fichiers sont
 *  DÉPLACÉS, jamais recopiés : ils gardent leur identifiant, donc tous
 *  les liens de vos pièces jointes. Rien n'est supprimé.
 */

/** La version de CE script. L'application la lit et vous prévient quand le
 *  script déployé dans votre Drive est plus ancien qu'elle ne l'attend. */
const VERSION_SCRIPT = 12;

/** Mot de passe partagé — mettez le vôtre, et le même dans l'application. */
const CLE = 'changez-moi';

/** Nom du fichier créé dans votre Drive pour conserver les dossiers. */
const NOM_FICHIER = 'Dossiers de vente - base.json';

/** Nom du dossier Drive où sont rangées les pièces jointes. */
const NOM_PIECES = 'Dossiers de vente — pièces';

/** Le dossier unique sous lequel TOUT est rangé. */
const NOM_RACINE = 'DOSSIERS DE VENTE';

/* ------------------------------------------------- UN SEUL DOSSIER -------
 *  Tout ce que l'application dépose dans votre Drive vit sous « DOSSIERS DE
 *  VENTE » : la base, les comptes, les sauvegardes du jour et les pièces
 *  jointes. C'est là qu'on les range, et c'est là qu'on les cherche.
 *
 *  Jusqu'à la version 11, chaque fichier était cherché dans TOUT le Drive,
 *  par son nom. Cela paraissait souple ; c'était fragile. Le jour où une
 *  recherche ne rend rien — un fichier devenu invisible au script pour une
 *  raison qui ne tient pas à nous —, le script en recrée un VIDE à la
 *  racine, et l'on se retrouve avec deux fichiers du même nom dont le plus
 *  récent ne contient rien. C'est arrivé le 22 octobre 2026.
 *
 *  La version 12 pose trois garde-fous :
 *    · tout est rangé sous un dossier unique ;
 *    · on y cherche d'abord, et dans le reste du Drive seulement ensuite —
 *      auquel cas on DÉPLACE ce qu'on trouve dans le dossier, une fois pour
 *      toutes. Rien n'est dupliqué, rien n'est recopié : le déplacement
 *      conserve l'identifiant, donc tous les liens des pièces jointes ;
 *    · quand plusieurs fichiers portent le même nom, on retient LE PLUS
 *      GARNI, et non le plus récent. C'est le cœur du correctif : un
 *      fichier vide créé le soir est PLUS RÉCENT qu'un fichier plein écrit
 *      le matin, et trier par date aurait reproduit la panne.
 *
 *  Rien n'est jamais supprimé : un doublon est ignoré, pas détruit. Le
 *  Drive de quelqu'un ne se nettoie pas tout seul.
 */
function dossierRacine() {
  const it = DriveApp.getFoldersByName(NOM_RACINE);
  while (it.hasNext()) {
    const f = it.next();
    if (!f.isTrashed()) return f;
  }
  return DriveApp.createFolder(NOM_RACINE);
}

/** Déplace un fichier ou un dossier sous la racine, s'il n'y est pas déjà. */
function rangerDans(x, dossier) {
  try {
    const p = x.getParents();
    while (p.hasNext()) if (p.next().getId() === dossier.getId()) return x;
    x.moveTo(dossier);
  } catch (err) {
    /* un Drive qui refuse le déplacement — partage, quota — n'empêche pas
       de travailler : on rend l'objet tel qu'il est */
  }
  return x;
}

/** Le fichier de ce nom, rangé sous la racine. Le plus garni l'emporte. */
function fichierRange(nom) {
  const racine = dossierRacine();
  const l = [];
  const it = DriveApp.getFilesByName(nom);
  while (it.hasNext()) {
    const f = it.next();
    if (!f.isTrashed()) l.push(f);
  }
  if (!l.length) return racine.createFile(nom, '{}', MimeType.PLAIN_TEXT);
  l.sort(function (a, b) {
    const d = b.getSize() - a.getSize();
    return d !== 0 ? d : (b.getLastUpdated() - a.getLastUpdated());
  });
  return rangerDans(l[0], racine);
}

/** Le sous-dossier de ce nom, rangé sous la racine. */
function dossierRange(nom) {
  const racine = dossierRacine();
  let it = racine.getFoldersByName(nom);
  while (it.hasNext()) {
    const f = it.next();
    if (!f.isTrashed()) return f;
  }
  it = DriveApp.getFoldersByName(nom);
  while (it.hasNext()) {
    const f = it.next();
    if (!f.isTrashed()) return rangerDans(f, racine);
  }
  return racine.createFolder(nom);
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (String(p.cle || '') !== CLE) return sortie({ erreur: 'cle' });
  const porte = portier(p, 'lire');
  if (porte.erreur) return sortie(porte);
  return sortie({ ok: true, data: lireBase() });
}

function doPost(e) {
  let q = {};
  try {
    q = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return sortie({ erreur: 'json' });
  }
  if (String(q.cle || '') !== CLE) return sortie({ erreur: 'cle' });

  /* La clé partagée n'ouvre plus que le hall : ce qui suit demande un
     compte. Trois actions restent accessibles sans séance, parce qu'elles
     servent précisément à en ouvrir une. */
  try {
    if (q.action === 'etat')    return sortie(etatServeur(q));
    if (q.action === 'sel')     return sortie(selDe(q));
    if (q.action === 'ouvrir')  return sortie(ouvrirSeance(q));
    if (q.action === 'fermer')  return sortie(fermerSeance(q));
  } catch (err) {
    return sortie({ erreur: String(err && err.message || err) });
  }

  const porte = portier(q, q.action);
  if (porte.erreur) return sortie(porte);

  try {
    if (q.action === 'mdp_changer')     return sortie(changerMdp(q));
    if (q.action === 'comptes')         return sortie(comptesListe(q));
    if (q.action === 'compte_creer')    return sortie(compteCreer(q));
    if (q.action === 'compte_modifier') return sortie(compteModifier(q));
    if (q.action === 'compte_suppr')    return sortie(compteSupprimer(q));
  } catch (err) {
    return sortie({ erreur: String(err && err.message || err) });
  }

  /* Les pièces jointes ne touchent pas au fichier de base : elles n'ont pas
     besoin du verrou, et un envoi de plusieurs méga-octets ne doit pas bloquer
     l'enregistrement des dossiers pendant ce temps. */
  try {
    if (q.action === 'agenda')          return sortie(agendaCreer(q));
    if (q.action === 'agenda_annuler')  return sortie(agendaAnnuler(q));
    if (q.action === 'piece_envoi')     return sortie(pieceEnvoi(q));
    if (q.action === 'piece_lire')      return sortie(pieceLire(q));
    if (q.action === 'piece_renommer')  return sortie(pieceRenommer(q));
    if (q.action === 'piece_supprimer') return sortie(pieceSupprimer(q));
  } catch (err) {
    return sortie({ erreur: String(err && err.message || err) });
  }

  const verrou = LockService.getScriptLock();
  try {
    verrou.waitLock(25000);
  } catch (err) {
    return sortie({ erreur: 'occupe' });
  }
  try {
    if (q.action === 'ecrire') {
      ecrireBase(protegerCarnets(lireBase(), q.data || {}));
      return sortie({ ok: true });
    }
    return sortie({ ok: true, data: lireBase() });   // action « lire » par défaut
  } finally {
    verrou.releaseLock();
  }
}

/* ------------------------------------------------------------------ Drive */

function fichierBase() { return fichierRange(NOM_FICHIER); }

function lireBase() {
  const t = fichierBase().getBlob().getDataAsString('UTF-8');
  try {
    return JSON.parse(t || '{}');
  } catch (err) {
    return {};
  }
}

function ecrireBase(d) {
  const f = fichierBase();
  copieDuJour(f);
  f.setContent(JSON.stringify(d));
}

/* --------------------------------------------------- filet de sécurité ----
 *  DERNIER REMPART SUR LES CARNETS. Les carnets — immeubles, négociateurs,
 *  notaires, clercs, syndics — n'ont qu'une seule date pour tout le bloc :
 *  à la fusion, le plus récent l'emporte. Un appareil dont les carnets
 *  étaient encore ceux de l'installation a donc pu, un jour, reverser son
 *  vide ici et effacer les immeubles partout.
 *
 *  La page corrigée ne le fait plus. Mais un appareil resté sur une version
 *  ancienne de la page, lui, ne le sait pas — et c'est le script qui garde
 *  le fichier. On recolle donc ici tout carnet garni que l'enregistrement
 *  entrant viderait, sans rien refuser à l'appelant.
 *
 *  Contrepartie assumée : vider un carnet ENTIER ne se propage plus. Retirer
 *  des lignes une à une, si.
 */
function cleEntreeGs(v) {
  /* même règle que dans l'application : une fiche qui porte un identifiant
     propre se reconnaît par lui — deux acquéreurs peuvent porter le même nom */
  if (typeof v === 'string') return v;
  return String((v || {}).id || (v || {}).nom || '');
}
function protegerCarnets(ancien, neuf) {
  try {
    const a = (ancien || {}).listes, n = (neuf || {}).listes;
    if (!a || !n) return neuf;
    const sup = (neuf || {}).listesSupprimes || {};
    Object.keys(a).forEach(function (k) {
      const av = a[k], nv = n[k];
      if (!(av instanceof Array)) return;
      if (!(nv instanceof Array)) { n[k] = av; return; }
      /* Entrée par entrée : tout ce que la base avait et que
         l'enregistrement n'a plus revient, SAUF ce qui a été retiré
         volontairement — le registre des retraits le dit. */
      const vus = {};
      nv.forEach(function (v) { vus[cleEntreeGs(v)] = true; });
      av.forEach(function (v) {
        const cle = cleEntreeGs(v);
        if (!cle || vus[cle]) return;
        if (sup[k + '|' + cle]) return;          // retirée exprès
        nv.push(v);
      });
    });
  } catch (err) {}
  return neuf;
}

/* ------------------------------------------------- sauvegardes du jour ----
 *  Avant la première écriture de chaque journée, on met de côté la base
 *  telle qu'elle était. Quinze jours en arrière, un fichier par jour, dans
 *  un dossier « Dossiers de vente - sauvegardes ». La copie du jour n'est
 *  jamais réécrite : elle garde l'état du MATIN, ce qui est précisément ce
 *  qu'on veut le soir où l'on s'aperçoit d'une perte.
 */
const NOM_COPIES = 'Dossiers de vente - sauvegardes';
const COPIES_GARDEES = 15;

function dossierCopies() { return dossierRange(NOM_COPIES); }

function copieDuJour(fichier) {
  try {
    const texte = fichier.getBlob().getDataAsString('UTF-8');
    if (!texte || texte.length < 64) return;          // rien d'utile à garder
    const jour = Utilities.formatDate(new Date(), 'Europe/Paris', 'yyyy-MM-dd');
    const nom = 'base ' + jour + '.json';
    const dos = dossierCopies();
    if (dos.getFilesByName(nom).hasNext()) return;    // déjà faite ce matin
    dos.createFile(nom, texte, MimeType.PLAIN_TEXT);
    const gardees = [];
    const it = dos.getFiles();
    while (it.hasNext()) gardees.push(it.next());
    gardees.sort(function (x, y) { return x.getName() < y.getName() ? 1 : -1; });
    for (let i = COPIES_GARDEES; i < gardees.length; i++) gardees[i].setTrashed(true);
  } catch (err) {}
}

/* --------------------------------------------------------- pièces jointes */

/** Le dossier racine des pièces, créé au premier envoi. */
function racinePieces() { return dossierRange(NOM_PIECES); }

/** Descend — en créant au besoin — la suite de sous-dossiers demandée. */
function dossierChemin(parties) {
  let d = racinePieces();
  (parties || []).forEach(function (nom) {
    nom = nettoieNom(nom);
    if (!nom) return;
    const it = d.getFoldersByName(nom);
    let suivant = null;
    while (it.hasNext()) {
      const f = it.next();
      if (!f.isTrashed()) { suivant = f; break; }
    }
    d = suivant || d.createFolder(nom);
  });
  return d;
}

/** Drive accepte presque tout, mais la barre oblique couperait l'arborescence. */
function nettoieNom(s) {
  return String(s || '').replace(/[\\\\/]+/g, '-').replace(/\\s+/g, ' ').trim().slice(0, 120);
}

/** Un nom déjà pris dans ce dossier reçoit un suffixe plutôt qu'un doublon. */
function nomLibre(dossier, nom) {
  nom = nettoieNom(nom) || 'piece';
  const pt = nom.lastIndexOf('.');
  const base = pt > 0 ? nom.slice(0, pt) : nom;
  const ext  = pt > 0 ? nom.slice(pt) : '';
  let essai = nom, n = 2;
  while (dossier.getFilesByName(essai).hasNext()) {
    essai = base + ' (' + n + ')' + ext;
    n++;
    if (n > 200) break;
  }
  return essai;
}

/** { chemin:[...], nom, type, data(base64) } -> { ok, drive, nom, taille } */
function pieceEnvoi(q) {
  const octets = Utilities.base64Decode(q.data || '');
  const blob = Utilities.newBlob(octets, q.type || 'application/octet-stream',
                                 nettoieNom(q.nom) || 'piece');
  const dossier = dossierChemin(q.chemin);
  const nom = nomLibre(dossier, q.nom);
  blob.setName(nom);
  const f = dossier.createFile(blob);
  return { ok: true, drive: f.getId(), nom: nom, taille: f.getSize() };
}

/* ------------------------------------------------------------- Agenda
 *
 * Un rendez-vous de visite, posé dans l'agenda de celui qui a déployé ce
 * script. Trois choses s'y jouent :
 *
 *  · les INVITÉS — les adresses du demandeur, à qui Google envoie son
 *    invitation ;
 *  · la PIÈCE JOINTE — la fiche du bien en PDF. CalendarApp ne sait pas
 *    attacher ; le service avancé « Google Calendar API », lui, sait le
 *    faire à partir d'un fichier du Drive. On l'essaie, et s'il n'est pas
 *    activé dans le projet, on se rabat sur le LIEN du fichier écrit dans
 *    la description : la fiche est alors à un clic, ce qui vaut mieux
 *    qu'un échec ;
 *  · le LIEU, qui est une adresse : Google Agenda la rend cliquable, et
 *    le téléphone y trouve son itinéraire.
 *
 * { titre, lieu, texte, debut(ISO), fin(ISO), invites[], piece{nom,type,data} }
 *   -> { ok, lien, jointe }
 */
function agendaCreer(q) {
  const debut = new Date(q.debut), fin = new Date(q.fin);
  if (isNaN(debut.getTime()) || isNaN(fin.getTime()))
    return { erreur: 'dates du rendez-vous illisibles' };
  const titre = String(q.titre || 'Visite');
  const invites = (q.invites || []).filter(function (x) { return !!x; });

  /* la fiche, d'abord : son lien peut entrer dans la description */
  let fichier = null;
  if (q.piece && q.piece.data) {
    try {
      const blob = Utilities.newBlob(Utilities.base64Decode(q.piece.data),
        q.piece.type || 'application/pdf', nettoieNom(q.piece.nom) || 'Fiche.pdf');
      const dossier = dossierChemin(['Fiches de visite']);
      blob.setName(nomLibre(dossier, q.piece.nom || 'Fiche.pdf'));
      fichier = dossier.createFile(blob);
    } catch (err) { fichier = null; }
  }
  let texte = String(q.texte || '');
  if (fichier) texte += '\\n\\nFiche du bien : ' + fichier.getUrl();

  /* la voie complète : le service avancé, qui sait joindre un fichier */
  if (fichier && typeof Calendar !== 'undefined' && Calendar.Events) {
    try {
      const ev = Calendar.Events.insert({
        summary: titre,
        location: String(q.lieu || ''),
        description: texte,
        start: { dateTime: debut.toISOString() },
        end:   { dateTime: fin.toISOString() },
        attendees: invites.map(function (m) { return { email: m }; }),
        attachments: [{
          fileUrl: fichier.getUrl(),
          title: fichier.getName(),
          mimeType: 'application/pdf'
        }]
      }, 'primary', { supportsAttachments: true, sendUpdates: 'all' });
      return { ok: true, lien: ev.htmlLink || '', jointe: true,
               ev: ev.id || '', voie: 'avance' };
    } catch (err) {
      /* service avancé non activé : on continue par la voie simple */
    }
  }
  const cal = CalendarApp.getDefaultCalendar();
  const ev = cal.createEvent(titre, debut, fin, {
    description: texte,
    location: String(q.lieu || ''),
    guests: invites.join(','),
    sendInvites: invites.length > 0
  });
  return { ok: true, lien: lienEvenement(ev, cal), jointe: false,
           ev: ev.getId(), voie: 'simple' };
}

/** { ev, voie } -> { ok, prevenus }  — le rendez-vous quitte l'agenda.
 *
 *  Les deux voies ne nomment pas un événement de la même façon : le service
 *  avancé rend un identifiant nu, CalendarApp y accole « @google.com ». On
 *  essaie donc l'une puis l'autre, plutôt que de parier sur celle qui l'a
 *  créé — un agenda retouché à la main entre-temps ne doit pas nous arrêter.
 *  Un rendez-vous déjà disparu n'est pas une erreur : le but est qu'il ne
 *  soit plus là. */
function agendaAnnuler(q) {
  const id = String(q.ev || '').trim();
  if (!id) return { erreur: 'aucun rendez-vous à annuler' };
  if (typeof Calendar !== 'undefined' && Calendar.Events) {
    try {
      Calendar.Events.remove('primary', id.split('@')[0], { sendUpdates: 'all' });
      return { ok: true, prevenus: true };
    } catch (err) { /* pas le bon identifiant pour cette voie, ou déjà parti */ }
  }
  try {
    const ev = CalendarApp.getDefaultCalendar().getEventById(id);
    if (!ev) return { ok: true, absent: true };
    ev.deleteEvent();
    return { ok: true, prevenus: true };
  } catch (err) {
    return { erreur: String(err && err.message || err) };
  }
}
function lienEvenement(ev, cal) {
  try {
    return 'https://calendar.google.com/calendar/u/0/r/eventedit/'
      + Utilities.base64Encode(ev.getId().split('@')[0] + ' '
          + cal.getId()).replace(/=+$/, '');
  } catch (err) { return ''; }
}
/** { drive } -> { ok, data(base64), type, nom } */
function pieceLire(q) {
  const f = DriveApp.getFileById(q.drive);
  const b = f.getBlob();
  return {
    ok: true,
    data: Utilities.base64Encode(b.getBytes()),
    type: b.getContentType(),
    nom: f.getName()
  };
}

/** { drive, nom } -> { ok, renomme, nom }  — le fichier du Drive suit le nom
 *  donné dans l'application, sinon la même pièce en porterait deux. */
function pieceRenommer(q) {
  const f = DriveApp.getFileById(q.drive);
  const dossier = f.getParents().hasNext() ? f.getParents().next() : null;
  const nom = dossier ? nomLibre(dossier, q.nom) : nettoieNom(q.nom);
  f.setName(nom);
  return { ok: true, renomme: true, nom: nom };
}

/** { drive } -> { ok }  — le fichier part à la corbeille, pas au néant. */
function pieceSupprimer(q) {
  try {
    DriveApp.getFileById(q.drive).setTrashed(true);
  } catch (err) {
    /* déjà supprimé à la main : ce n'est pas une erreur */
  }
  return { ok: true };
}

/* -------------------------------------------- réécriture d'une annonce ---
   Le script ne fabrique pas la consigne : elle lui arrive toute faite de
   l'application, qui sait seule ce qu'il y a dans le dossier. Ici on ne fait
   que relayer l'appel en y mettant la clé — c'est tout l'intérêt : la clé
   reste dans votre compte Google. */
/* ====================================================== LES COMPTES ====
   La vraie serrure est ici, pas dans la page.

   La page de l'application est publique : déposée sur GitHub Pages, son
   code se télécharge. Un écran de connexion écrit dedans arrête un
   collègue ou un curieux, pas quelqu'un de déterminé. Ce qu'on protège
   pour de bon, c'est l'accès aux DONNÉES — et elles sont ici, dans votre
   Drive, derrière ce script. Sans compte valide, le script ne livre
   rien : ni dossiers, ni pièces jointes.

   Les comptes vivent dans un fichier à part, que le script est seul à
   lire. L'action « lire » ne le renvoie jamais : un mot de passe, même
   dérivé, n'a pas à descendre dans un navigateur.

   Ce qu'on garde d'un mot de passe : PBKDF2-HMAC-SHA256 sur 210 000
   tours, calculé DANS LE NAVIGATEUR avec un sel propre à chaque compte,
   puis haché une seconde fois ici avec votre clé CLE en guise de poivre.
   Le mot de passe en clair ne quitte donc jamais le poste de celui qui
   le tape, et quelqu'un qui lirait ce fichier de comptes n'y trouverait
   rien d'utilisable : il lui manquerait votre CLE, qui est dans ce code
   et non dans le fichier.

   Tant qu'aucun compte n'existe, le script se comporte comme avant et
   se contente de la clé partagée. C'est voulu : on peut déposer cette
   version sans rien casser, puis créer les comptes depuis l'application.
   Dès le premier compte créé, la clé seule ne suffit plus.
   ===================================================================== */

/** Nom du fichier Drive où sont rangés les comptes. */
const NOM_COMPTES = 'Dossiers de vente - comptes.json';

/** Durée d'une séance, en heures. Au-delà, il faut se reconnecter. */
const SEANCE_H = 12;

/** Blocage après cinq échecs, pendant quinze minutes. La CNIL admet un
 *  mot de passe moins fort dès lors que les tentatives sont bridées ;
 *  les nôtres sont forts ET bridés. */
const ECHECS_MAX = 5;
const BLOCAGE_MIN = 15;

function fichierComptes() { return fichierRange(NOM_COMPTES); }
function lireComptes() {
  try {
    const o = JSON.parse(fichierComptes().getBlob().getDataAsString('UTF-8') || '{}');
    o.comptes = o.comptes || [];
    o.jetons  = o.jetons  || {};
    o.echecs  = o.echecs  || {};
    return o;
  } catch (err) {
    return { comptes: [], jetons: {}, echecs: {} };
  }
}
function ecrireComptes(o) {
  fichierComptes().setContent(JSON.stringify(o));
}

/* ------------------------------------------------------------ outils */
function hexa(oct) {
  let s = '';
  for (let i = 0; i < oct.length; i++) {
    const b = (oct[i] + 256) % 256;
    s += (b < 16 ? '0' : '') + b.toString(16);
  }
  return s;
}
function sha(txt) {
  return hexa(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, txt,
                                      Utilities.Charset.UTF_8));
}
function hmac(cle, txt) {
  return hexa(Utilities.computeHmacSha256Signature(txt, cle));
}
/** De quoi tirer un sel ou un jeton qu'on ne devine pas. */
function alea() {
  return sha(Utilities.getUuid() + Utilities.getUuid() + new Date().getTime()
             + Math.random());
}
/** Ce qu'on range à la place du mot de passe. */
function empreinteRangee(empreinteClient) {
  return sha(String(empreinteClient || '') + '|' + CLE);
}
/** Une comparaison qui ne s'arrête pas au premier caractère différent. */
function memeChaine(a, b) {
  a = String(a || ''); b = String(b || '');
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
function normIdent(s) {
  return String(s || '').trim().toLowerCase();
}
function trouveCompte(base, ident) {
  const id = normIdent(ident);
  for (let i = 0; i < base.comptes.length; i++)
    if (normIdent(base.comptes[i].ident) === id) return base.comptes[i];
  return null;
}
function publicCompte(c) {
  return { ident: c.ident, nom: c.nom || '', role: c.role || 'nego',
           actif: c.actif !== false, doitChanger: !!c.doitChanger,
           cree: c.cree || '', derniere: c.derniere || '' };
}

/* ----------------------------------------------- le sel, avant l'entrée
   On répond toujours, même pour un identifiant inconnu : un sel inventé
   mais stable, tiré de l'identifiant et de la clé. Sans cela, la page de
   connexion dirait qui existe et qui n'existe pas. */
function selDe(q) {
  const base = lireComptes();
  const c = trouveCompte(base, q.ident);
  return { ok: true, sel: c && c.sel ? c.sel : hmac(CLE, 'sel:' + normIdent(q.ident)),
           tours: 210000 };
}

/* ---------------------------------------------------------- se connecter */
function ouvrirSeance(q) {
  const base = lireComptes();
  const id = normIdent(q.ident);
  const maintenant = new Date().getTime();

  const e = base.echecs[id];
  if (e && e.jusqua > maintenant)
    return { erreur: 'bloque', minutes: Math.ceil((e.jusqua - maintenant) / 60000) };

  const c = trouveCompte(base, id);
  const bon = c && c.actif !== false
           && memeChaine(c.hash, empreinteRangee(q.empreinte));
  if (!bon) {
    /* On ne repart de zéro que si un blocage PRÉCÉDENT est arrivé à son
       terme. Écrit « e.jusqua <= maintenant », le compte remettait son
       compteur à 1 à chaque essai — puisque jusqu'à cinq échecs,
       « jusqua » vaut 0, donc toujours inférieur à maintenant. La porte
       ne se serait jamais bloquée. */
    const expire = e && e.jusqua > 0 && e.jusqua <= maintenant;
    const n = (expire || !e ? 0 : e.n) + 1;
    base.echecs[id] = { n: n,
      jusqua: n >= ECHECS_MAX ? maintenant + BLOCAGE_MIN * 60000 : 0 };
    ecrireComptes(base);
    return n >= ECHECS_MAX
      ? { erreur: 'bloque', minutes: BLOCAGE_MIN }
      : { erreur: 'refuse', reste: ECHECS_MAX - n };
  }

  delete base.echecs[id];
  const jeton = alea();
  /* on balaie les séances expirées au passage : le fichier ne doit pas
     enfler d'un jeton par connexion depuis deux ans */
  Object.keys(base.jetons).forEach(function (j) {
    if (base.jetons[j].exp < maintenant) delete base.jetons[j];
  });
  base.jetons[jeton] = { ident: c.ident, exp: maintenant + SEANCE_H * 3600000 };
  c.derniere = new Date().toISOString();
  ecrireComptes(base);
  return { ok: true, jeton: jeton, profil: publicCompte(c),
           expire: base.jetons[jeton].exp };
}

/** Qui est derrière ce jeton ? null si personne, ou si la séance a expiré. */
function quiEst(base, jeton) {
  const j = base.jetons[String(jeton || '')];
  if (!j) return null;
  if (j.exp < new Date().getTime()) { delete base.jetons[String(jeton)]; return null; }
  const c = trouveCompte(base, j.ident);
  if (!c || c.actif === false) return null;
  return c;
}

function fermerSeance(q) {
  const base = lireComptes();
  delete base.jetons[String(q.jeton || '')];
  ecrireComptes(base);
  return { ok: true };
}

/* ------------------------------------------------ changer son mot de passe */
function changerMdp(q) {
  const base = lireComptes();
  const c = quiEst(base, q.jeton);
  if (!c) return { erreur: 'seance' };
  if (!memeChaine(c.hash, empreinteRangee(q.ancienne))) return { erreur: 'ancien' };
  if (!q.nouvelle || String(q.nouvelle).length < 32) return { erreur: 'empreinte' };
  c.hash = empreinteRangee(q.nouvelle);
  c.doitChanger = false;
  c.change = new Date().toISOString();
  /* on ferme les autres séances : un mot de passe changé, c'est souvent
     parce qu'on le croit connu d'un autre */
  Object.keys(base.jetons).forEach(function (j) {
    if (normIdent(base.jetons[j].ident) === normIdent(c.ident) && j !== q.jeton)
      delete base.jetons[j];
  });
  ecrireComptes(base);
  return { ok: true, profil: publicCompte(c) };
}

/* ------------------------------------------- l'administration des comptes */
function estAdmin(base, jeton) {
  const c = quiEst(base, jeton);
  return c && c.role === 'admin' ? c : null;
}

function comptesListe(q) {
  const base = lireComptes();
  /* le premier compte se crée sans être connecté : tant qu'il n'y en a
     aucun, la liste est ouverte — elle est vide, de toute façon */
  if (base.comptes.length && !estAdmin(base, q.jeton)) return { erreur: 'droit' };
  return { ok: true, comptes: base.comptes.map(publicCompte) };
}

function compteCreer(q) {
  const base = lireComptes();
  const premier = base.comptes.length === 0;
  if (!premier && !estAdmin(base, q.jeton)) return { erreur: 'droit' };
  const id = normIdent(q.ident);
  if (!/^[a-z0-9._-]{3,32}$/.test(id)) return { erreur: 'ident' };
  if (trouveCompte(base, id)) return { erreur: 'existe' };
  if (!q.empreinte || String(q.empreinte).length < 32) return { erreur: 'empreinte' };
  /* le tout premier compte est forcément administrateur : sans cela,
     personne ne pourrait créer les suivants */
  const role = premier ? 'admin'
             : (['admin','nego','lecture'].indexOf(q.role) >= 0 ? q.role : 'nego');
  const c = { ident: id, nom: String(q.nom || '').trim(), role: role,
              sel: q.sel || alea(), hash: empreinteRangee(q.empreinte),
              doitChanger: q.doitChanger !== false, actif: true,
              cree: new Date().toISOString(), derniere: '' };
  base.comptes.push(c);
  ecrireComptes(base);
  return { ok: true, compte: publicCompte(c), premier: premier };
}

function compteModifier(q) {
  const base = lireComptes();
  const moi = estAdmin(base, q.jeton);
  if (!moi) return { erreur: 'droit' };
  const c = trouveCompte(base, q.ident);
  if (!c) return { erreur: 'inconnu' };
  if (q.nom !== undefined) c.nom = String(q.nom).trim();
  if (q.role !== undefined && ['admin','nego','lecture'].indexOf(q.role) >= 0) {
    /* on ne se retire pas à soi-même le dernier trousseau */
    const autresAdmins = base.comptes.filter(function (x) {
      return x.role === 'admin' && x.actif !== false
          && normIdent(x.ident) !== normIdent(c.ident); }).length;
    if (c.role === 'admin' && q.role !== 'admin' && !autresAdmins)
      return { erreur: 'dernieradmin' };
    c.role = q.role;
  }
  if (q.actif !== undefined) {
    const autresAdmins = base.comptes.filter(function (x) {
      return x.role === 'admin' && x.actif !== false
          && normIdent(x.ident) !== normIdent(c.ident); }).length;
    if (c.role === 'admin' && q.actif === false && !autresAdmins)
      return { erreur: 'dernieradmin' };
    c.actif = !!q.actif;
    if (!c.actif) Object.keys(base.jetons).forEach(function (j) {
      if (normIdent(base.jetons[j].ident) === normIdent(c.ident)) delete base.jetons[j];
    });
  }
  /* un mot de passe provisoire remis par l'administrateur */
  if (q.empreinte) {
    if (String(q.empreinte).length < 32) return { erreur: 'empreinte' };
    c.sel = q.sel || c.sel;
    c.hash = empreinteRangee(q.empreinte);
    c.doitChanger = true;
    delete base.echecs[normIdent(c.ident)];
    Object.keys(base.jetons).forEach(function (j) {
      if (normIdent(base.jetons[j].ident) === normIdent(c.ident)) delete base.jetons[j];
    });
  }
  ecrireComptes(base);
  return { ok: true, compte: publicCompte(c) };
}

function compteSupprimer(q) {
  const base = lireComptes();
  const moi = estAdmin(base, q.jeton);
  if (!moi) return { erreur: 'droit' };
  const c = trouveCompte(base, q.ident);
  if (!c) return { erreur: 'inconnu' };
  if (normIdent(c.ident) === normIdent(moi.ident)) return { erreur: 'soimeme' };
  const autresAdmins = base.comptes.filter(function (x) {
    return x.role === 'admin' && x.actif !== false
        && normIdent(x.ident) !== normIdent(c.ident); }).length;
  if (c.role === 'admin' && !autresAdmins) return { erreur: 'dernieradmin' };
  base.comptes = base.comptes.filter(function (x) {
    return normIdent(x.ident) !== normIdent(c.ident); });
  Object.keys(base.jetons).forEach(function (j) {
    if (normIdent(base.jetons[j].ident) === normIdent(c.ident)) delete base.jetons[j];
  });
  ecrireComptes(base);
  return { ok: true };
}

/* ------------------------------------------------------ le portier
   Appelé devant CHAQUE action qui touche aux données. Il rend le compte
   qui agit, ou une erreur. Tant qu'aucun compte n'existe, il laisse
   passer : c'est ce qui permet de déposer cette version sans se
   verrouiller dehors. */
const ACTIONS_ECRITURE = ['ecrire','piece_envoi','piece_renommer','piece_supprimer'];

function portier(q, action) {
  const base = lireComptes();
  if (!base.comptes.length) return { ouvert: true, compte: null };
  const c = quiEst(base, q.jeton);
  if (!c) return { erreur: 'seance' };
  if (c.role === 'lecture' && ACTIONS_ECRITURE.indexOf(action) >= 0)
    return { erreur: 'lectureseule' };
  return { ouvert: true, compte: c };
}

/** L'état de la serrure, que la page interroge avant d'afficher quoi que
 *  ce soit. Elle ne demande aucun droit : savoir qu'une porte est fermée
 *  n'a jamais ouvert une porte. */
function etatServeur(q) {
  const base = lireComptes();
  const c = base.comptes.length ? quiEst(base, q.jeton) : null;
  return { ok: true, version: VERSION_SCRIPT, comptes: base.comptes.length,
           profil: c ? publicCompte(c) : null };
}

function sortie(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}

/** ►►► À LANCER UNE FOIS depuis l'éditeur après avoir collé cette version.
 *
 *  Choisissez « autoriser » dans la liste des fonctions, en haut de
 *  l'éditeur, puis ▶ Exécuter. Google affiche l'écran des autorisations :
 *  acceptez-le. L'avertissement « application non vérifiée » est normal,
 *  c'est votre propre script — « Paramètres avancés » puis « Accéder à … ».
 *
 *  Pourquoi c'est nécessaire : une application web déployée s'exécute avec
 *  les autorisations que VOUS lui avez données, et elle n'a aucun moyen de
 *  vous en demander de nouvelles — il n'y a personne devant l'écran. Tant
 *  que l'agenda n'est pas autorisé, la création d'un rendez-vous échoue sur
 *  « The script does not have permission to perform that action ».
 *
 *  Il n'y a rien à redéployer après : l'autorisation vaut pour le script,
 *  pas pour un déploiement en particulier.
 */
function autoriser() {
  const cal = CalendarApp.getDefaultCalendar();
  const nb = cal.getEventsForDay(new Date()).length;
  const dossier = racinePieces();
  Logger.log("Agenda : " + cal.getName() + " — " + nb + " evenement(s) ce jour");
  Logger.log("Pieces : " + dossier.getUrl());
  Logger.log("Base   : " + fichierBase().getUrl());
  Logger.log("Tout est autorise. Revenez a l'application.");
  return true;
}

/** Facultatif : lancez cette fonction depuis l'éditeur pour voir où en est la
 *  base — elle ne fait que LIRE.
 *
 *  Elle écrivait autrefois un enregistrement d'essai, ce qui remplaçait le
 *  contenu du fichier par { essai: true }. La copie du jour le rattrapait,
 *  mais une fonction de vérification n'a rien à faire dans les données :
 *  elle est juste à côté d'« autoriser » dans la liste de l'éditeur, et son
 *  nom n'annonce pas qu'elle efface. Elle ne touche plus à rien.           */
function verifier() {
  const base = lireBase();
  const d = (base || {}).dossiers || {};
  const l = (base || {}).listes || {};
  Logger.log('Version du script : ' + VERSION_SCRIPT);
  Logger.log('Base    : ' + fichierBase().getUrl());
  Logger.log('Dossiers en base : ' + Object.keys(d).length);
  Logger.log('Listes  : ' + Object.keys(l).length + ' rubrique(s)');
  Logger.log('Pieces  : ' + racinePieces().getUrl());
  Logger.log('Copies  : ' + dossierCopies().getUrl());
  Logger.log('Rien n a ete modifie.');
}