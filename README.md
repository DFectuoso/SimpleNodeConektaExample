
### Requerimientos

Necesitas tener instalado:

* Node 0.10.21
* npm
* git

Una vez instalado npm/node, estar seguro de contar con supervisor

```
npm install -g node-inspector supervisor forever
```

Despues de eso, puedes correr la app con

```
supervisor --debug server.js
```

Se espera que este corriendo mongo y redis... Para instalar mongo en Mongo

```
brew update
brew install mongodb
```

y tambien

```
brew install redis
```

##### Para correr Redis

```
redis-server /usr/local/etc/redis.conf
```

##### Para correr MongoDb

```
mongod
```
