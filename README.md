# Prompt Api server

---
To run:
`node prompt.js`

API apiserver (prod)
```
  ssh -i ~/.ssh/collegellama.pem ubuntu@52.14.14.234  
```
Dev for Apiserver & dev mysql
```
  ssh -i ~/.ssh/collegellama.pem ubuntu@13.58.133.179
```

`.env` file needs to be set up per environment:
Required values (set up to according environment)
```
 API_APP_PORT=5005
 API_DB_HOST=localhost
 API_DB_PORT=3306
 API_DB_USER=root
 API_DB_PASSWORD=root
 API_DB_NAME=colleges
```
