//ローカルストレージ
// https://jp.vuejs.org/v2/examples/todomvc.html

var STORAGE_KEY = 'todos-vuejs-demo'
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

//リストデータ保管
//todoリスト追加
new Vue({
    el: '#app',

    data: {
        todos: [],
        //デフォルトは すべて にする
        current: -1,
        options: [
            { value: -1, label: 'すべて' },
            { value: 0, label: '作業中' },
            { value: 1, label: '完了' }
        ],
    },
    el: '#app',

    computed: {

        computedTodos: function () {
          // データ current が -1 ならすべて
          // それ以外なら current と state が一致するものだけに絞り込む
          return this.todos.filter(function(el) {
            return this.current < 0 ? true : this.current === el.state
          }, this)
        },
        labels() {
            return this.options.reduce(function (a, b) {
                return Object.assign(a, { [b.value]: b.label })
            }, {})
        }
      },

      watch: {
        todos: {
            handler: function (todos) {
                todoStorage.save(todos)
            },
            deep: true
        }
    },
    created() {
        this.todos = todoStorage.fetch()
    },
    //todoリストの追加、変更、削除の処理一覧
    methods: {
        // todo追加時の処理内容
        doAdd: function(event, value) {
            //refで設定した名前を利用
            var comment = this.$refs.comment
            //もし入力なければ何もせずにリターン
            if (!comment.value.length) {
                return
            }
            //{ID,コメント,作業状態}のオブジェクトを現在のtodosリストへ送る
            this.todos.push({
                id: todoStorage.uid++,
                comment: comment.value,
                state: 0
            })
            //フォームを空にしておく
            comment.value = ''
        },
        //状態変更時の処理内容
        doChangeState: function(item) {
            item.state = !item.state ? 1 :0
        },
        //削除時の処理内容
        doRemove: function(item) {
            var index =this.todos.indexOf(item)
            this.todos.splice(index,1)
        },
        //すべて削除時の処理内容（100件削除）
        all_deleate: function() {
            this.todos.splice(0,100)
        }
    }
})


