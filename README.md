# 📦 Mini CDN Upload API (Dockerized)

Cette API Express permet :
- Upload de fichiers via `/upload`
- Authentification via Header `Authorization: Bearer <clé>`
- Fichiers renommés en UUID et stockés dans un dossier configuré
- Fichiers consultables en accès public via `/cdn/<filename>`

---

## ⚙️ Configuration

La configuration se fait via des fichiers montés dans le conteneur à `/conf` :

- `/conf/.api` → contient **la clé API** (`super_secret_key` par exemple)
- `/conf/.path` → contient **le chemin du dossier CDN** (`/data/cdn` par exemple)

---

## ▶️ Lancer avec Docker Compose

(docker-compose.yml inclus dans le projet en exemple)

```bash
docker-compose up --build
```

# 📤 Exemple d’upload
```bash
curl -X POST http://localhost:3000/upload \
  -H "Authorization: Bearer super_secret_key" \
  -F "file=@image.jpg"
```
Réponse :
```json
{
  "url": "/cdn/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg"
}
```
# 📂  Dossier monté
- ./conf → configurations .api et .path
- ./data → contenu CDN

# 🧼 Nettoyage
```
docker-compose down```