const commitMessageChecker = require('./commit-message-checker');

describe('commit message checker', () => {

    const acceptedCommit =
        [
            'feat(example): my example',
            'fix(example): my example',
            'fix: my example',
            'chore: zefe',
            '2.0.1',
            '02.02.001',
            'release(changelog): Update changelog.md [CI SKIP]',
        ]

    acceptedCommit.forEach(commitMessage => {
        it(`should accept "${commitMessage}"`, () => {
            expect(commitMessageChecker(commitMessage)).toBeTruthy()
        })
    })


    const notAcceptedCommit =
    [
        'feat(example) : my example',
        'fix(example):my example',
        'fixe: my example'
    ]
    notAcceptedCommit.forEach(commitMessage => {
        it(`should NOT accept "${commitMessage}"`, () => {
            expect(commitMessageChecker(commitMessage)).toBeFalsy()
        })
    })
})
