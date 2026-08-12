---
title: 'A BigDecimal Checklist for Money'
description: 'Small Java rules that prevent surprising amounts, comparisons, and rounding behavior.'
pubDate: '2026-08-10'
category: 'Notes'
homeHeroOrder: 2
homeOrder: 2
---

`BigDecimal` is the usual Java choice for decimal monetary values, but choosing
the type is only the beginning. Construction, scale, equality, and rounding all
need explicit rules.

## Construct from decimal text

Prefer a string when the decimal value matters exactly:

```java
BigDecimal amount = new BigDecimal("19.99");
```

Avoid constructing from a binary floating-point value:

```java
BigDecimal surprising = new BigDecimal(19.99);
```

`BigDecimal.valueOf(19.99)` is safer than the constructor because it uses the
canonical string form of the `double`, but decimal text at the system boundary
is clearer still.

## Keep currency beside the amount

A decimal without a currency is incomplete monetary data. A compact value type
can protect the invariant:

```java
public record Money(BigDecimal amount, Currency currency) {
    public Money {
        Objects.requireNonNull(amount);
        Objects.requireNonNull(currency);
    }
}
```

## Compare values intentionally

`equals` considers scale; `compareTo` compares numerical value:

| Expression                              | Result  |
| --------------------------------------- | ------- |
| `new BigDecimal("2.0").equals(2.00)`    | `false` |
| `new BigDecimal("2.0").compareTo(2.00)` | `0`     |

Use `compareTo` for amount ordering and zero checks. Use `equals` only when scale
is intentionally part of identity.

## Round at named boundaries

Do not scatter rounding through arbitrary intermediate calculations. Apply it at
a boundary with an explicit mode:

```java
BigDecimal postedAmount = calculatedAmount.setScale(2, RoundingMode.HALF_EVEN);
```

The number of decimal places is currency-dependent, so a production design
should derive scale from the monetary policy rather than assuming every currency
uses two.

## Checklist

- Parse decimal strings at boundaries.
- Carry the currency with the value.
- Use `compareTo` for numerical comparisons.
- Name the rounding mode and scale.
- Decide whether persisted scale is normalized.
- Test negative values, zero, large values, and midpoint rounding.

The important rule is consistency: money should follow one policy from input to
persistence to output.
