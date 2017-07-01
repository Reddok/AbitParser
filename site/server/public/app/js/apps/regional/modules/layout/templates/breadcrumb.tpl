<li>
    <a href="#regions" data-trigger="regions:list">
        <span>Регіони</span>
    </a>
</li>


{{ if(region){}}
   {{ if(univer) { }}
        <li><a href="#regions/{{= region._id}}" data-trigger="univers:list" data-id="{{= region._id}}">
                <span>{{= region.name}}</span>
            </a></li>
   {{ } else { }}
        <li class="active">
            <span>
                <span>{{= region.name}}</span>
             </span>
        </li>
   {{ } }}
{{ } }}

{{ if(univer){}}
   {{ if(spec) { }}
        <li>
            <a href="#univers/{{= univer._id}}" data-trigger="specs:list" data-id="{{= univer._id}}">
                <span>{{= univer.name}}</span>
            </a>
        </li>
   {{ } else { }}
        <li class="active">
            <span>
                <span>{{= univer.name}}</span>
            </span>
        </li>
   {{ } }}
{{ } }}

{{ if(spec){  }}<li class="active">
                    <span>
                       <span>{{= spec.name}}</span>
                    </span>
                </li>{{ } }}
