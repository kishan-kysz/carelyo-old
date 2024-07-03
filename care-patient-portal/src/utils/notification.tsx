import { notifications } from "@mantine/notifications";
import { UseTranslationResponse, useTranslation } from 'react-i18next';

/*
    To add a new notification

    1. Add a new NotificationType enum.
        Try and follow the naming standard <Category><Type> ie. BookingError Booking = category, Error = type

    2. Add title, message, color for each type in your category in public/translation/En/default.json at notifications category
       Create a new category if it's missing in the notifications category
       Try and follow the same naming when creating a type ie. 

    "booking":{ //Category
        "success": { //Type
         "title":"Booking Successful",
         "message":"Continue to payment",
         "color": "green"
        },
        "error":{ //Type
         "title":"Booking Error",
         "message":"An error occured while creating your booking.",
         "color": "red"
        }
    }

    3. Case the enum in showNotification


    When testing you have to ctrl + f5 or start/stop react because it has to load json files to the client side.

    Adding json for each language is not possible so do the ones you know.
*/

enum NotificationType {
    PaymentSuccess,
    PaymentFailed,
    PaymentCancelled,
    PaymentError,
    ApiError,
    BookingSuccess,
    BookingError,
    RecordingDeleted
};


const showNotification = (notificationType: NotificationType, t: UseTranslationResponse<[string], undefined>[0]): void => {
    switch(notificationType)
    {
        case NotificationType.PaymentSuccess:
                notifications.show({
                    title: t('tr.payment.success.title'),
                    message: t('tr.payment.success.message'),
                    color: t('tr.payment.success.color')
                });
            break;
        case NotificationType.PaymentFailed:
                notifications.show({
                    title: t('tr.payment.failed.title'),
                    message: t('tr.payment.failed.message'),
                    color: t('tr.payment.failed.color')
                });
            break;
        case NotificationType.PaymentCancelled:
                notifications.show({
                    title: t('tr.payment.cancelled.title'),
                    message: t('tr.payment.cancelled.message'),
                    color: t('tr.payment.cancelled.color')
                });
            break;
        case NotificationType.PaymentError:
                notifications.show({
                    title: t('tr.payment.error.title'),
                    message: t('tr.payment.error.message'),
                    color: t('tr.payment.error.color')
                });
            break;
        case NotificationType.ApiError:
                notifications.show({
                    title: t('tr.api.error.title'),
                    message: t('tr.api.error.message'),
                    color: t('tr.api.error.color')
                });
            break;
        case NotificationType.BookingSuccess:
                notifications.show({
                    title: t('tr.booking.success.title'),
                    message: t('tr.booking.success.message'),
                    color: t('tr.booking.success.color')
                });
            break;
        case NotificationType.BookingError:
                notifications.show({
                    title: t('tr.booking.error.title'),
                    message: t('tr.booking.error.message'),
                    color: t('tr.booking.error.color')
                });
            break;
        case NotificationType.RecordingDeleted:
                notifications.show({
                    title: t('tr.recording.deleted.title'),
                    message: t('tr.recording.deleted.message'),
                    color: t('tr.recording.deleted.color')
                });
            break;
        default:
            console.log("Invalid notification type: " + notificationType);
            break;
    }
};

export { showNotification, NotificationType };
