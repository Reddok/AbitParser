{{ if(totalPages > 1){ }}
<ul class="pagination">
    {{ if(currentPage > 1){ }}
        <li > <a href="{{- urlBase? urlBase + 1 : ''}}" class="navigatable" data-page="1"> &laquo; </a> </li>
        <li > <a href="{{- urlBase? urlBase + previousPage : ''}}" class="navigatable" data-page="{{- previousPage }}" > &lsaquo; </a> </li>
    {{ }else{ }}
        <li class="disabled" > <span href="#" > &laquo; </span> </li>
        <li class="disabled" > <span href="#" > &lsaquo; </span> </li>
    {{ } }}

    {{ if(currentPage > 3 ){ }}
        <li class="disabled" > <a href="#" > ... </a> </li>
    {{ } }}

    {{ _.each(pageSet, function(page){ }}
                {{ if(page === currentPage){ }}
                  <li class="active disabled"><a href="#">{{- page }}</a></li>
                {{ }else{ }}
                  <li><a href="{{- urlBase? urlBase + page : ''}}" class="navigatable" data-page="{{- page }}">{{- page }}</a></li>
                {{ } }}
    {{ }); }}

    {{ if(currentPage < lastPage - 2){ }}
        <li class="disabled" > <a href="#" > ... </a> </li>
        <li > <a href="{{- urlBase? urlBase + lastPage : ''}}" class="navigatable" data-page="{{- lastPage }}"> {{- lastPage }} </a> </li>
    {{ } }}

    {{ if(currentPage !== lastPage){ }}
        <li > <a href="{{- urlBase? urlBase + nextPage : ''}}" class="navigatable" data-page="{{- nextPage }}"> &rsaquo; </a> </li>
        <li > <a href="{{- urlBase? urlBase + lastPage : ''}}" class="navigatable" data-page="{{- lastPage }}"> &raquo; </a> </li>
    {{ }else{ }}
        <li class="disabled" > <span href="#" > &rsaquo; </span> </li>
        <li class="disabled" > <span href="#" > &raquo; </span> </li>
    {{ } }}
</ul>
{{ } }}