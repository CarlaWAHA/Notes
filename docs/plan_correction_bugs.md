# Plan de correction des bugs

**Application**: Notes - Système de gestion des notes étudiantes
**Version**: 1.0
**Date**: 20 Juillet 2026

## 1. Objectifs

- Détecter, documenter et corriger les anomalies
- Prioriser selon l'impact métier
- Garantir la stabilité des parcours admin et étudiant
- Conserver une traçabilité claire entre bug, correction et test

## 2. Méthodologie

1. Détection
2. Consignation
3. Analyse
4. Assignation
5. Correction
6. Déploiement
7. Vérification
8. Clôture

## 3. Niveaux de criticité

| Niveau | Définition | Délai cible |
|--------|------------|-------------|
| Critique | Blocage d'une fonction majeure | < 2h |
| Majeur | Fonction dégradée mais contournable | < 12h |
| Mineur | UX ou fonction partielle dégradée | < 48h |
| Cosmétique | Sans impact fonctionnel | < 1 semaine |

## 4. Fiche type

### BUG-XXX: Titre du bug

**Sévérité**: Critique / Majeur / Mineur / Cosmétique
**Statut**: Ouvert / En cours / Résolu / Clos

#### Description

Décrire le comportement anormal observé.

#### Étapes de reproduction

1. Ouvrir l'application
2. Se connecter
3. Exécuter l'action concernée

#### Comportement attendu

Décrire le résultat attendu.

#### Comportement observé

Décrire le résultat réel.

#### Analyse de la cause racine

Expliquer la cause technique.

#### Résolution

- Fichiers modifiés
- Description du correctif
- Validation effectuée

#### Tests de régression

- [ ] Test unitaire
- [ ] Test d'intégration
- [ ] Test e2e
- [ ] Vérification en préproduction

## 5. Bugs déjà identifiés et corrigés

### BUG-001: `routerLink` non reconnu sur la liste des notes

- **Sévérité**: Critique
- **Statut**: Résolu
- **Cause**: cache navigateur / artefact ancien
- **Correctif**: redémarrage complet et vidage du cache

### BUG-002: route SSR non synchronisée

- **Sévérité**: Critique
- **Statut**: Résolu
- **Cause**: route serveur obsolète après refonte
- **Correctif**: alignement des routes serveur et client

### BUG-003: filtre de token rejetant les endpoints publics

- **Sévérité**: Critique
- **Statut**: Résolu
- **Cause**: le filtre bloquait `/auth/login`
- **Correctif**: laisser l'authentification publique passer sans Bearer token

### BUG-004: configuration CORS limitée à un seul port

- **Sévérité**: Majeur
- **Statut**: Résolu
- **Cause**: port frontend codé en dur
- **Correctif**: ports 4200 et 4201 autorisés

### BUG-005: dashboard de supervision sans datasource

- **Sévérité**: Majeur
- **Statut**: Résolu côté documentation / en cours d'exploitation
- **Cause**: datasource non provisionnée dans Grafana
- **Correctif**: ajouter Prometheus puis Jaeger via provisioning

## 6. Workflow de correction

DÉTECTION → CONSIGNATION → ANALYSE → CORRECTION → TEST → DÉPLOIEMENT → VÉRIFICATION

## 7. Règles de validation

- Valider en premier le chemin critique le plus court
- Tester le correctif sur le périmètre touché uniquement
- Ne pas élargir le diagnostic sans besoin
- Conserver les modifications minimales et traçables
