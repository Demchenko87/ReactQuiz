import React, {Component} from "react";
import classes from './Quiz.module.css'
import ActiveQuiz from "../../components/ActiveQuiz/ActiveQuiz";
import FinishedQuiz from '../../components/FinishedQuiz/FinishedQuiz'

class Quiz extends Component {
    state = {
        results: {},
        isFinished: false,
        activeQuestion: 0,
        answerState: null, // { [id]: 'success' | 'error' }
        quiz: [
            {
                question: 'Какого цвета небо ?',
                rightAnswerId: 2,
                id: 1,
                answers: [
                    {text: 'Черное', id: 1},
                    {text: 'Синее', id: 2},
                    {text: 'Красное', id: 3},
                    {text: 'Зеленое', id: 4},

                ]
            },
            {
                question: 'Кто основал Facebook?',
                rightAnswerId: 1,
                id: 2,
                answers: [
                    {text: 'Макр Цукерберг', id: 1},
                    {text: 'Стив Джобс', id: 2},
                    {text: 'Билл Гейдс', id: 3},
                    {text: 'Сергей Брин', id: 4},

                ]
            }
        ]
    }

    onAnswerClickHandler = answerId => {
        const results =this.state.results
        if (this.state.answerState){
            const key = Object.keys(this.state.answerState)[0]
            if (this.state.answerState[key] === 'success') {
                return
            }
        }

        const question = this.state.quiz[this.state.activeQuestion]
        if (question.rightAnswerId === answerId) {
            if (!results[question.id]) {
                results[question.id] = 'success'
            }

            this.setState({
                answerState: {[answerId]: 'success'},
                results: results
            })
            const timeout = window.setTimeout(()=> {
                if (this.isQuizFinish()) {
                   this.setState({
                       isFinished: true
                   })
                } else {

                    this.setState({
                    activeQuestion: this.state.activeQuestion +1,
                        answerState: null
                })
                }

                window.clearTimeout(timeout)
            }, 1000)


        } else {
            results[question.id] = 'error'
            this.setState({
                answerState: {[answerId]: 'error'},
                results: results
            })
        }

    }

    isQuizFinish () {
        return this.state.activeQuestion +1 === this.state.quiz.length
    }
    retryHandler = () => {
        this.setState({
            activeQuestion: 0,
            answerState: null,
            isFinished: false,
            results: {}
        })
    }

    componentDidMount() {
        console.log('Quize ID', this.props.match.params.id)
    }

    render() {
        return (
            <div className={classes.Quiz}>

                <div className={classes.QuizWrapper}>
                     <h1>Дайте ответ на все вопросы</h1>
                    {
                        this.state.isFinished
                        ? <FinishedQuiz
                            results={this.state.results}
                            quiz={this.state.quiz}
                            onRetry={this.retryHandler}
                            />

                        :<ActiveQuiz
                    answers={this.state.quiz[this.state.activeQuestion].answers}
                    question={this.state.quiz[this.state.activeQuestion].question}
                    onAnswerClick={this.onAnswerClickHandler}
                    quizLength={this.state.quiz.length}
                    answerNumber={this.state.activeQuestion + 1}
                    state={this.state.answerState}
                    />
                    }

                </div>
            </div>
        )
    }
}

export default Quiz
