import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { BottomNavigation, BottomNavigationAction, Card, CardActions, CardContent, Checkbox, CircularProgress, FormControlLabel, Snackbar, TextField } from '@material-ui/core';
import AndroidIcon from '@material-ui/icons/Android';
import GetAppIcon from '@material-ui/icons/GetApp';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
const useStyles = makeStyles((theme) => ({
  card_root: {
    width: '100%',
    marginBottom: 10
  },
  card_bullet: {
    display: 'inline-block',
  },
  card_title: {
    fontSize: 14,
  },
  card_pos: {
    // marginBottom: 12,
  },

  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  heading: {
    flexGrow: 1,
    textAlign: 'center',
    fontSize: 22
  },
  pincodeInput: {
    width: '100%',
    marginTop: 8
  },
  searchButton: {
    flexGrow: 1,
    width: '100%'
  },
  resultsArea: {
    height: '140vw',
  }
}));
export default function App() {
  const classes = useStyles();
  const [pincode, setPincode] = useState()
  const [showError, setShowError] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [bottomValue, setBottomValue] = useState(0)
  const [showFooter, setShowFooter] = useState(true)
  const [emptyView, setEmptyView] = useState(null)

  useEffect(() => {
    if (getMobileOperatingSystem() === 'Android') {
      alert('You can download the app where it can give you notifications if vaccine is available\nCheck the top right button after clicking Ok')
    }
  }, [])
  const getMobileOperatingSystem = () => {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/windows phone/i.test(userAgent)) {
      return 'Windows Phone';
    }
    if (/android/i.test(userAgent)) {
      return 'Android';
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'iOS';
    }
    return 'unknown';
  }
  const isUsingAndroid = () => getMobileOperatingSystem() === 'Android'
  const toTwoDigit = (number) => {
    return number < 10 ? `0${number}` : `${number}`
  }
  const getFormattedDate = () => {
    const date = new Date()
    const day = toTwoDigit(date.getDate())
    const month = toTwoDigit(date.getMonth() + 1)
    const year = toTwoDigit(date.getFullYear())
    return `${day}-${month}-${year}`
  }
  const checkPincode = () => {
    setLoading(true)
    setData([])
    setShowFooter(true)
    setEmptyView(false)
    fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pincode}&date=${getFormattedDate()}`, { mode: 'cors' })
      .then(resp => {
        setLoading(false)
        if (resp.status != 200) throw new Error(resp.status)
        resp.json().then(j => {
          const centers = j['centers']
          setData(centers)
          setEmptyView(centers.length === 0)
        })
        setShowFooter(false)

      })
      .catch(err => {
        setShowError(true)
        setLoading(false)
      })
  }
  const getResults = () => {
    return data.map(it => <Card key={it.center_id} className={classes.card_root}>
      <CardContent>
        <Typography style={{ fontSize: 22 }}>
          {it.name}
        </Typography>
        <Typography style={{ marginBottom: 10 }}>
          {it.address}
        </Typography>
        <Typography>
          {it.sessions.map(session => `Date: ${session.date}\nSlots: ${session.slots.join(',')}\nAvailability: ${session.available_capacity}\nMinimum age limit: ${session.min_age_limit}`).join('\n').split('\n').map((item, i) => {
            if (i > 0 && item.includes('Date:')) {
              return <div style={{ marginTop: 20 }} key={i}>{item}</div>
            }
            return <div key={i}>{item}</div>
          })}
        </Typography>
      </CardContent>
    </Card>)
  }
  return (
    <div >
      <AppBar position='sticky'>
        <Toolbar>
          <Typography className={classes.title}>
            COVID-19 Vaccine Tracker
        </Typography>
          {isUsingAndroid() && <Button color='inherit' onClick={() => window.location.href = '/app-release.apk'}><AndroidIcon style={{ marginRight: 8 }} /> app <GetAppIcon style={{ marginLeft: 8 }} /></Button>}
        </Toolbar>
      </AppBar>
      <div style={{ padding: 10 }}>
        <Typography className={classes.heading}>
          Check your nearest vaccination center and slots availability
    </Typography>

        <TextField id='standard-basic' variant='outlined' onChange={(event) => setPincode(event.target.value)} label='Enter Pincode' className={classes.pincodeInput} value={pincode} />

        <Button onClick={checkPincode} className={classes.searchButton} variant='contained' color='primary'>
          Search
</Button>

        {emptyView && <div>No availability</div>}


        {loading && <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', marginTop: 50 }}>
          <CircularProgress />
        </div>}

        <div className={classes.resultsArea}>{getResults()}</div>

        {showFooter && <div style={{ bottom: '60px', position: 'absolute', width: '95vw' }}>
          <center>Made by Aditya Rajesh Mhatre<br />Find me on FB/ Instagram/ LinkedIn
          </center>
        </div>}
        <BottomNavigation
          style={{
            width: '100%',
            position: 'fixed',
            bottom: 0,
          }}
          value={bottomValue}
          onChange={(event, newValue) => {
            setBottomValue(newValue)
            var url = ''
            switch (newValue) {
              case 0: url = 'https://www.facebook.com/aditya.r.mhatre'; break;
              case 1: url = 'https://instagram.com/adityamhatre'; break;
              case 2: url = 'https://www.linkedin.com/in/aditya-mhatre'; break;
            }
            window.open(url, '_blank')
          }}
          showLabels
          className={classes.root}>
          <BottomNavigationAction label="Facebook" icon={<FacebookIcon />} />
          <BottomNavigationAction label="Instagram" icon={<InstagramIcon />} />
          <BottomNavigationAction label="LinkedIn" icon={<LinkedInIcon />} />
        </BottomNavigation>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={showError}
          onClose={() => setShowError(false)}
          autoHideDuration={1000}
          message='Some error occurred' />
      </div>
    </div >
  );
}

