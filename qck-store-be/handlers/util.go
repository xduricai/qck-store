package handlers

import "time"

func FormatDate(inputDate string) (string, error) {
	format := "2006-01-02T15:04:05Z"
	if t, err := time.Parse(format, inputDate); err != nil {
		return "", err
	} else {
		return t.Format("02/01/2006 15:04:05"), nil
	}
}

func GetUTCTime() string {
	currentTime := time.Now().UTC()
	return currentTime.Format("2006-01-02 15:04:05")
}
