<div class="container">
    <div class="row">
        <div class="col-md-8">
        <h1>Помилка!</h1>
            <p class="bg-danger error-message">
                Якщо ви опинились на цій сторінці, значить в роботі додатку сталась якась помилка. Ми пофіксимо її так швидко, як тільки зможемо.<br><br>
                Текст помилки: <span class="text-danger">{{= message}}</span>.<br><br>
                Вибачаємось за завдані незручності.
            </p>
            <p class="bg-primary">Перевірте чи правильно вказаний адрес. Якщо так, то спробуйте перезавантажити сторінку.
            При повторенні помилки зачекайте деякий час і спробуйте знову</p>
        </div>
        <div class="col-md-4">
            <image class="block-center img-responsive" src="{{= staticMap("/public/app/images/error-cat.jpg") }}" title="error-cat" alt="error-cat" />
        </div>
    </div>
</div>