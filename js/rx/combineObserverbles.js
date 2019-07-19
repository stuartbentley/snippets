import $ from '../../vendor/jquery-1.11.2.js';
import mailcheck from '../../../node_modules/mailcheck/src/mailcheck.js';
import { fromEvent, merge } from 'rxjs';
import { filter } from 'rxjs/operators';
import { take } from 'rxjs/operators';

export default function runMailCheck(element, parentSelector = '.form-group') {

    $('.js-email-typo-hint').remove();

    mailcheck.run({
        email: element.value,
        suggested: function (suggestion) {

            if (suggestion.full.length) {

                $(element)
                    .closest(parentSelector)
                    .addClass('has-error')
                    .append('<a href="#" onclick="" class="help-block js-email-typo-hint">Did you mean ' + suggestion.full + '?</a>');

                const typoHintClickObservable = fromEvent(
                    document.querySelector('.js-email-typo-hint'), 'click');

                const enterKeyUpObservable = fromEvent(
                    document, 'keyup')
                    .pipe(filter( e => e.keyCode === 13 ));

                merge(typoHintClickObservable, enterKeyUpObservable)
                    .pipe(take(1))
                    .subscribe((e) => {
                        element.value = suggestion.full;
                        $('.js-email-typo-hint').remove();
                    });
            }
        }
    });


};
