import Logo from './assets/LOGO.png'
import NotificationIcon from './assets/Notification.svg'
import Dropdown from './assets/Expand Arrow.svg'
import styles from './cssmodules/Header.module.css'

function Header(){  

    const headerContent = <div className={styles.header}>
                            <div className={styles.logo}>
                              <img src={Logo}></img>
                            </div>
                            <div className={styles.title}>
                                <span className={styles.pro}>PRO</span>
                                <span className={styles.tasker}>NOTE</span>
                            </div>
                            <div className={styles.account}>
                                {/* <img className={styles.notifIcon} src={NotificationIcon} alt="" /> */}
                                {/* <img src="https://via.placeholder.com/30" alt="" />
                                <div className={styles.name}>
                                    <h1>Ironheartmcu</h1>
                                    <img src={Dropdown} alt="" />
                                </div> */}
                            </div>
                        </div>

    return(headerContent);

}

export default Header   