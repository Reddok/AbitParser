<form class="search-form" id="search-form" role="form">
    <div class="row">
       <div class="col-sm-10 text-center-xs">
            <div class="form-group">
                <label for="pattern-field">Введіть фамілію студента:</label>
                <input type="text" name="pattern" id="pattern-field" class="form-control" placeholder="Іванов І. І." />
                <span class="glyphicon glyphicon-remove form-control-feedback"></span>
            </div>
       </div>
       <div class="col-sm-2 text-center">
            <div class="form-group">
                <label for="year-field">Рік вступу:</label>
                <select type="text" name="year" id="year-field" class="form-control">
                    {{ years.forEach(function(item) { }}
                         <option value="{{=item}}">{{=item}}</option>
                    {{ }) }}
                </select>
            </div>
       </div>
    </div>
    <button type="submit" class="btn btn-primary js-submit" id="search-submit">Знайти</button>
</form>



