//
//  Copyright (c) 2016 Apple Inc. All rights reserved.
//

#import <XCTest/XCTestDefines.h>
#import <XCTest/XCTestExpectation.h>
#import <XCTest/XCTestCase+AsynchronousTesting.h>

NS_ASSUME_NONNULL_BEGIN

/*!
 * @class XCTNSPredicateExpectation
 * Expectation subclass for waiting on a condition defined by an NSPredicate and an object.
 */
@interface XCTNSPredicateExpectation : XCTestExpectation {
#ifndef __OBJC2__
@private
    id _internal;
#endif
}

- (instancetype)init NS_UNAVAILABLE;
- (instancetype)initWithDescription:(NSString *)expectationDescription NS_UNAVAILABLE;

/*!
 * @method -initWithPredicate:object:
 * Initializes an expectation that waits for a predicate to evaluate as true with the provided object.
 */
- (instancetype)initWithPredicate:(NSPredicate *)predicate object:(nullable id)object NS_DESIGNATED_INITIALIZER;

/*!
 * @property predicate
 * Returns the predicate used by the expectation.
 */
@property (readonly, copy) NSPredicate *predicate;

/*!
 * @property object
 * Returns the object against which the predicate is evaluated.
 */
@property (nullable, readonly, strong) id object;

/*!
 * @property handler
 * Allows the caller to install a special handler to do custom evaluation of predicate and its object.
 */
@property (nullable, copy) XCPredicateExpectationHandler handler;

@end

NS_ASSUME_NONNULL_END
