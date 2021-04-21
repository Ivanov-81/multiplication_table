import React, {useEffect} from 'react'
import clsx from 'clsx'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Zoom from '@material-ui/core/Zoom'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import {red} from '@material-ui/core/colors'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ShareIcon from '@material-ui/icons/Share'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import {Button, makeStyles, TextField, Theme, withStyles} from "@material-ui/core"
import LinearProgress, {LinearProgressProps} from '@material-ui/core/LinearProgress'

import './App.css'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        maxWidth: '100%',
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
    tab: {
        textTransform: 'none'
    },
    input: {
        width: 50,
        margin: "0 0 15px 0",
        color: "#666666",
        "& input": {
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 600
        },
        "& p.Mui-error": {
            position: "absolute",
            top: 46,
            fontSize: "11px",
            margin: "0 0 0 10px",
            background: "#FFF",
            padding: "0 3px",
        },
        "& p": {
            fontSize: "16px",
            marginLeft: "0px",
            marginTop: "2px",
            color: "#666",
        },
    },
    multiplication: {
        fontSize: '40px',
        margin: '10px 10px 0'
    },
    equally: {
        fontSize: '32px',
        margin: '8px 10px 0'
    },
    progress: {},
    calc: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttons: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    button: {
        // margin: theme.spacing(1),
    },
    message: {
        position: 'absolute',
        right: 40,
        top: 15,
        fontSize: 20,
        fontWeight: 600
    },
    limit: {
        position: 'absolute',
        left: 15,
        top: 15
    }
}));

const CssTextField = withStyles({
    root: {
        borderRadius: "4px",
        '& input:disabled + fieldset': {
            border: "2px solid #EBEBEB !important",
        },
        '& label.Mui-focused': {
            color: '#EBEBEB',
            border: "2px solid #EBEBEB",
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#EBEBEB',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#EBEBEB',
                border: "2px solid #EBEBEB",
            },
            '&:hover fieldset': {
                borderColor: '#EBEBEB',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#EBEBEB',
            },
        },
    },
})(TextField);

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">
                    {`${Math.round(props.value,)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

function App() {

    const classes = useStyles();

    const [value, setValue] = React.useState(0);
    const [text, setText] = React.useState('Правильно');
    const [color, setColor] = React.useState('lime');

    const [num1, setNum1] = React.useState<number>(0);
    const [num2, setNum2] = React.useState<number>(0);
    const [result, setResult] = React.useState<number>(0);
    const [progress, setProgress] = React.useState<number>(0);
    const [limit, setLimit] = React.useState<number>(9);
    const [disable, setDisable] = React.useState<boolean>(false);
    const [show_message, showMessage] = React.useState<boolean>(false);


    const mathRound = (num: number, nm: number) => {
        return Math.round(num * nm) / nm;
    }

    const randomInteger = (max: number = 9, min: number = 1) => {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }


    const genNumbers = () => {

        let LS: any = localStorage.getItem('progress')

        if(LS) {
            let data: any = JSON.parse(LS)
            data.count = data.count + 1
            localStorage.setItem('progress',JSON.stringify(data))
        }

        setDisable(true)
        showMessage(false)
        setNum1(randomInteger(limit));
        setNum2(randomInteger(limit));
        setResult(0)
    }


    const checkResult = () => {

        let data: any, LS: any = localStorage.getItem('progress')

        if(LS) data = JSON.parse(LS)

        setDisable(false)
        if ((num1 * num2) === result) {
            setText('Правильно!')
            setColor('lime')
            data.true = data.true + 1
        } else {
            setText('Не правильно!')
            setColor('red')
            data.false = data.false + 1
        }
        localStorage.setItem('progress',JSON.stringify(data))
        calcProgress(data)
    }


    const calcProgress = (data: any) => {
        let res: number = (data.true / data.count) * 100
        setProgress(mathRound(res,1))
    };


    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };


    const handleChangeResult = (evt: any) => {
        setResult(Number(evt.target.value));
    };


    const handleLimit = (evt: any) => {
        setLimit(Number(evt.target.value));
    };


    useEffect(() => {
        let LS: any = localStorage.getItem('progress')
        if(!LS) {
            localStorage.setItem('progress',JSON.stringify({count: 0, true: 0, false: 0}))
            setProgress(0);
        }
        else {
            let data: any = JSON.parse(LS)
            calcProgress(data)
        }
    },[])


    useEffect(() => {
        if (result !== 0) showMessage(true)
    }, [disable])

    return (
        <div className="App">
            <Card className="wrapper">


                <Zoom in={show_message}>
                    <div
                        className={classes.message}
                        style={{color: color}}
                    >
                        {text}
                    </div>
                </Zoom>

                <Tabs
                    value={value}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleChange}
                    aria-label="disabled tabs example"
                >
                    <Tab label="Таблица умножения" className={classes.tab}/>
                </Tabs>
                <CardContent>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="section"
                        className={classes.calc}
                    >
                        <CssTextField
                            // error={errorEmail}
                            // helperText={helperEmail}
                            name="email"
                            type="text"
                            value={limit}
                            className={clsx(classes.input, classes.limit)}
                            margin="normal"
                            variant="outlined"
                            onChange={handleLimit}
                            InputProps={{
                                inputProps: {
                                    maxLength: 1
                                },
                            }}
                        />

                        <CssTextField
                            // error={errorEmail}
                            // helperText={helperEmail}
                            name="email"
                            type="text"
                            value={num1}
                            className={clsx(classes.input)}
                            margin="normal"
                            variant="outlined"
                            InputProps={{
                                inputProps: {
                                    maxLength: 1,
                                    readOnly: true
                                },
                            }}
                        />

                        <span className={classes.multiplication}>*</span>

                        <CssTextField
                            // error={errorEmail}
                            // helperText={helperEmail}
                            name="email"
                            type="text"
                            value={num2}
                            className={clsx(classes.input)}
                            margin="normal"
                            variant="outlined"
                            InputProps={{
                                inputProps: {
                                    maxLength: 1,
                                    readOnly: true
                                },
                            }}
                        />

                        <span className={classes.equally}>=</span>

                        <CssTextField
                            // error={errorEmail}
                            // helperText={helperEmail}
                            name="email"
                            type="text"
                            value={result}
                            className={clsx(classes.input)}
                            margin="normal"
                            variant="outlined"
                            onChange={handleChangeResult}
                            InputProps={{
                                inputProps: {
                                    maxLength: 2
                                },
                            }}
                        />

                    </Typography>

                    <div className={classes.buttons}>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={genNumbers}
                            disabled={disable}
                        >
                            Новый пример
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={checkResult}
                            disabled={!disable}
                        >
                            Проверить
                        </Button>

                    </div>

                    <div className={classes.progress}>
                        <LinearProgressWithLabel value={progress}/>
                    </div>

                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                        <FavoriteIcon/>
                    </IconButton>
                    <IconButton aria-label="share">
                        <ShareIcon/>
                    </IconButton>
                </CardActions>
            </Card>
        </div>
    );
}

export default App;
