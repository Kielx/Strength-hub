# 💪 Strength-Hub

![GitHub issues](https://img.shields.io/github/issues-raw/kielx/strength-hub?logo=github)
![GitHub](https://img.shields.io/github/license/kielx/strength-hub)

A place to track your strength training plans

## App overview

Strength-Hub is an app that at its basic form helps strength athletes to easily create weight progression for their 5/3/1 program without unneeded hassle.
Weight progression is a cornerstone of any (good) strength training plan. The same applies to the 5/3/1 plan. 
A good description of the plan is provided here: https://www.t-nation.com/workouts/5-3-1-how-to-build-pure-strength/

So if you decided to try the 5/3/1 plan you have to do two things.
1. Go to the gym and test your 1 rep maxes for given major lifts (squat, deadlift, bench press, overhead press) - unfortunately, there is no other way ;)
2. Calculate weight progression for each lift by calculating 90% of 1 rep max and then in turn calculating progression for each lift in the following weeks.

The second point is the hard part. People either give up at that point or if they are determined get a calculator from the deepest drawer in their house (or basement) and do the math. OR they calculate this stuff in an Excel spreadsheet - that was my case. But someday I decided that it would be easier for others if my excel spreadsheet looked better and was publicly available. Therefore I decided to create a strength-hub - a web app - where you can log in, input your one-rep maxes which are then safely stored in a database and which you can access anywhere on any device.

### Development Screenshot

<div align="center">
<img alt="Development screnshot" src="https://github.com/Kielx/Strength-Hub/blob/master/screenshots/Strength-hub.png?raw=true" width="400" />
</div>


## Strength-Hub as an MVP will feature:

- [x]  Input where the user provides their 1 Rep Max for Squat, Deadlift, Bench Press, and Overhead Press
- [x]  Based on 1 Rep max inputs app should calculate your proposed weight progress for next weeks
- [ ]  Checkboxes next to each set to confirm that user succeeded at lifting given weight
- [ ]  Checkbox to confirm that the whole workout was successful
- [x]  Those should be displayed in separate cards
- [x] Users should be able to register, login and save their progress

### Further thoughts

- [ ] User should be able to customize the plan
- [ ] Comparisons how user stacks against other users
- [ ] Visual representation of progress
