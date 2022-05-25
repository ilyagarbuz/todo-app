(function() {
    // создаём и возвращаес заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    // создаём и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button')

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = true;

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper); 

        return {
            form,
            input,
            button,
        }
    }

    // создаём и возвращаем список элемантов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(name, done) {
        let item = document.createElement('li');
        // кнопки помещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        // устанавливаем стили для элемента списка, а так же для размещения
        // кнопок в его правой части, с помощю flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;
        
        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        // вкладываем кнопки в один элемен, чтобы они объеденились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        if (done == true) {
            item.classList.toggle('list-group-item-success')
        }

        return {
            item,
            doneButton,
            deleteButton,
        }
    }

    function createTodoApp(container, title = 'Список дел', key) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);


        todoItemForm.form.addEventListener('input', function() {
            todoItemForm.button.disabled = false;
        })
        
        let savedTasks;

        if (JSON.parse(localStorage.getItem(key)) === null) {
            savedTasks = [];
        } else {
            savedTasks = JSON.parse(localStorage.getItem(key))
        }

        if (savedTasks != null) {
            for (let task of savedTasks) {
                let todoSavedItem = createTodoItem(task.name, task.done)

                todoSavedItem.doneButton.addEventListener('click', function() {
                    todoSavedItem.item.classList.toggle('list-group-item-success')
                    let searchName = task.name;
                    let index = savedTasks.findIndex(el => el.name === searchName);
                    if(!todoSavedItem.item.classList.contains('list-group-item-success')) {
                        savedTasks[index].done = false;
                        localStorage.setItem(key, JSON.stringify(savedTasks))
                    }
                    else {
                        savedTasks[index].done = true;
                        localStorage.setItem(key, JSON.stringify(savedTasks))
                    }
    
                })
                todoSavedItem.deleteButton.addEventListener('click', function() {
                    if (confirm('Вы уверены?')) {
                        todoSavedItem.item.remove();
                        let searchName = task.name;
                        let index = savedTasks.findIndex(el => el.name === searchName);
                        savedTasks.splice(index, 1)
                        console.log(savedTasks)
                        localStorage.setItem(key, JSON.stringify(savedTasks))
                    }
                })
    
                todoList.append(todoSavedItem.item);

            }
        }



        // браузер создаёт событие submit по нажатию на Enter или по нажатию на кнопку
        todoItemForm.form.addEventListener('submit', function(e) {
            // чтобы отменить перезагрузку странициы, при отправке формы, нужно предотвратить стандартное действие браузера
            e.preventDefault();
            // проверяем заполнение инпута пользователем, и если он пуст ничего не делаем
            if (!todoItemForm.input.value) {
                return;
            }

            let todoItem = createTodoItem(todoItemForm.input.value)
            let todoItemName = todoItemForm.input.value

            // добавляем обработчик событий на кнопки
            todoItem.doneButton.addEventListener('click', function() {
                todoItem.item.classList.toggle('list-group-item-success')
                let searchName = todoItemName;
                let index = savedTasks.findIndex(el => el.name === searchName);
                if(!todoItem.item.classList.contains('list-group-item-success')) {
                    savedTasks[index].done = false;
                    localStorage.setItem(key, JSON.stringify(savedTasks))
                }
                else {
                    savedTasks[index].done = true;
                    localStorage.setItem(key, JSON.stringify(savedTasks))
                }
            })
            todoItem.deleteButton.addEventListener('click', function() {
                if (confirm('Вы уверены?')) {
                    todoItem.item.remove();
                    let searchName = todoItemName;
                    let index = savedTasks.findIndex(el => el.name === searchName);
                    savedTasks.splice(index, 1)
                    console.log(savedTasks)
                    localStorage.setItem(key, JSON.stringify(savedTasks))
                }
            })


            todoList.append(todoItem.item);

            let todoId = todoItemForm.input.value
            let savedItem = {name: todoItemForm.input.value, done: false, id: todoId}
            savedTasks.push(savedItem)
            localStorage.setItem(key, JSON.stringify(savedTasks))
            
            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true;

        })
    }
   
    window.createTodoApp = createTodoApp;
})();


