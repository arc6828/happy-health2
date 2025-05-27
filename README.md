# Happy Health Happy Heart

## Credit Bootstrap Theme Free
https://startbootstrap.com/theme/new-age 

## Initial Configuration when create Project
```
composer global require laravel/installer
laravel new happy-health
```
### option
- starter kit: breeze
- breeze stack: react
- testing framework: Pest
- laravel version: 12.x

## dependencies
```
php artisan install:api
php artisan ziggy:generate
```
## after clone
```
composer install
npm install
copy .env.example .env
php artisan key:generate
php artisan migrate
```

## development run server start
```
composer run dev
composer dev:ssr
```

## production run build
```
git pull
composer install
npm install
npm run build
```

## switch tailwind css to bootstrap css
```
// resources/js/app.tsx (commnet this line)
// import '../css/app.css';

// resources/js/pages/welcome.tsx
// resources/js/layouts/app-layout.tsx
// resources/js/layouts/auth-layout.tsx
import '../../css/app.css';
```

