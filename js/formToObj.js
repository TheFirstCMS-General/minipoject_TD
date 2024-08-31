function formToObject(formSelector){
    const form = document.querySelector(formSelector)
    const obj = {};

    const inputs = form.querySelectorAll('input')
    for (const input of inputs) {
        if ( input.getAttribute('name')!= null) {
            const name = input.getAttribute('name');
            const value = input.value;
            obj[name] = value
        }
    }
    const selects = form.querySelectorAll('select')
    for (const select of selects){
        const name = select.getAttribute('name');
        const value = select.value;

        obj[name] = value
    }

    const textareas = form.querySelectorAll('textarea')
    for (const textarea of textareas){
        const name = textarea.getAttribute('name');
        const value = textarea.value;

        obj[name] = value

    }

    return obj;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(amount);
}

function formatDate(date){
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}
